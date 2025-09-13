import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramService } from '../src/telegramService';
import { SendGiftRequest, SendGiftResponse } from '../src/types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { recipientId, giftId, isChannel, accountType, apiId, apiHash, sessionString, userId } = req.body;

    // Validate required fields
    if (!recipientId || !giftId || !accountType || !apiId || !apiHash || !sessionString) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: recipientId, giftId, accountType, apiId, apiHash, sessionString' 
      });
      return;
    }

    // Create Telegram client
    const telegramService = new TelegramService({
      apiId: parseInt(apiId),
      apiHash,
      sessionString,
      userId: userId || 'unknown'
    });

    // Send gift
    const result = await telegramService.sendGift(recipientId, giftId, isChannel || false);

    // Disconnect client
    await telegramService.disconnect();

    const response: SendGiftResponse = {
      success: result.success,
      error: result.error,
      messageId: result.messageId
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Send gift error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}


import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramClientService } from '../src/telegramClient';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { accountType, apiId, apiHash, sessionString, userId, targetUserId } = req.body;

    // Validate required fields
    if (!accountType || !apiId || !apiHash || !sessionString) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: accountType, apiId, apiHash, sessionString' 
      });
      return;
    }

    // Create Telegram client
    const telegramClient = new TelegramClientService({
      apiId: parseInt(apiId),
      apiHash,
      sessionString,
      userId: userId || 'unknown'
    });

    // Get received gifts
    const result = await telegramClient.getReceivedGifts(targetUserId);

    // Disconnect client
    await telegramClient.disconnect();

    res.status(200).json({
      success: result.success,
      gifts: result.gifts,
      error: result.error
    });
  } catch (error: any) {
    console.error('Get received gifts error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}


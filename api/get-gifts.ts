import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramService } from '../src/telegramService';
import { GetGiftsResponse } from '../src/types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { accountType, apiId, apiHash, sessionString, userId } = req.body;

    // Validate required fields
    if (!accountType || !apiId || !apiHash || !sessionString) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: accountType, apiId, apiHash, sessionString' 
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

    // Get available gifts
    const result = await telegramService.getAvailableGifts();

    // Disconnect client
    await telegramService.disconnect();

    const response: GetGiftsResponse = {
      success: result.success,
      gifts: result.gifts,
      error: result.error
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Get gifts error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}


import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramService } from '../src/telegramService';
import { GetSimilarChannelsRequest, GetSimilarChannelsResponse } from '../src/types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      channelId,
      limit = 10,
      accountType = 'pull',
      apiId,
      apiHash,
      sessionString,
      userId
    } = req.body as GetSimilarChannelsRequest & {
      accountType?: 'pull' | 'main';
      apiId: number;
      apiHash: string;
      sessionString: string;
      userId: string;
    };

    if (!channelId) {
      res.status(400).json({
        success: false,
        error: 'Channel ID is required'
      });
      return;
    }

    if (!apiId || !apiHash || !sessionString || !userId) {
      res.status(400).json({
        success: false,
        error: 'Telegram credentials are required (apiId, apiHash, sessionString, userId)'
      });
      return;
    }

    // Validate session string is not empty
    if (!sessionString || sessionString.trim() === '') {
      res.status(400).json({
        success: false,
        error: 'Valid session string is required.'
      });
      return;
    }

    const telegramService = new TelegramService({
      apiId,
      apiHash,
      sessionString,
      userId
    });

    const result = await telegramService.getSimilarChannels(channelId, limit);
    
    await telegramService.disconnect();

    const response: GetSimilarChannelsResponse = result;
    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error in get-similar-channels endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}

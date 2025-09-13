import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramService } from '../src/telegramService';
import { GetBalanceResponse } from '../src/types';

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

    // Create Telegram service
    const telegramService = new TelegramService({
      apiId: parseInt(apiId),
      apiHash,
      sessionString,
      userId: userId || 'unknown'
    });

    // Get balance
    const result = await telegramService.getBalance();

    // Disconnect service
    await telegramService.disconnect();

    const response: GetBalanceResponse = {
      success: result.success,
      balance: result.balance,
      error: result.error
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}


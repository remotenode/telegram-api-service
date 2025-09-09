import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramClientService } from '../src/telegramClient';
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

    // Create Telegram client
    const telegramClient = new TelegramClientService({
      apiId: parseInt(apiId),
      apiHash,
      sessionString,
      userId: userId || 'unknown'
    });

    // Get balance
    const result = await telegramClient.getBalance();

    // Disconnect client
    await telegramClient.disconnect();

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


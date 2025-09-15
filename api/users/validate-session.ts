import { TelegramService } from '../src/telegramService';
import { createApiHandler } from '../src/utils/apiHandler';

/**
 * @summary Validate Session
 * @description Validate Telegram session and get user information
 */
export default createApiHandler(
  async (telegramService: TelegramService) => {
    return await telegramService.validateSession();
  },
  {
    corsHeaders: false // This endpoint doesn't need CORS headers
  }
);


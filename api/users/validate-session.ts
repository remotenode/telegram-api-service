import { TelegramService } from '../src/telegramService';
import { createApiHandler } from '../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService) => {
    return await telegramService.validateSession();
  },
  {
    corsHeaders: false // This endpoint doesn't need CORS headers
  }
);


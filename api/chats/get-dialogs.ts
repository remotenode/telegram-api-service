import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { limit = 100, offsetDate } = req.body;
    return await telegramService.chat.getDialogs(limit, { offsetDate });
  }
);

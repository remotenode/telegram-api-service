import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, reason, comment } = req.body;

    if (!chatId || !reason) {
      throw new Error('Chat ID and reason are required');
    }

    return await telegramService.chat.reportChat(chatId, reason, comment);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'reason']
  }
);

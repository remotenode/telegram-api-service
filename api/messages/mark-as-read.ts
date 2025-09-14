import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, messageIds } = req.body;

    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    return await telegramService.message.markAsRead(chatId, messageIds);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId']
  }
);

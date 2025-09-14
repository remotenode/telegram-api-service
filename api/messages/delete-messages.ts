import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, messageIds, revoke = true } = req.body;

    if (!chatId || !messageIds || !Array.isArray(messageIds)) {
      throw new Error('chatId and messageIds array are required');
    }

    return await telegramService.message.deleteMessages(chatId, messageIds, revoke);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageIds']
  }
);
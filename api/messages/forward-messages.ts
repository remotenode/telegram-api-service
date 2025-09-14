import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { fromChatId, toChatId, messageIds, silent, dropAuthor, dropMediaCaptions } = req.body;

    if (!fromChatId || !toChatId || !messageIds || !Array.isArray(messageIds)) {
      throw new Error('fromChatId, toChatId, and messageIds array are required');
    }

    return await telegramService.message.forwardMessages(fromChatId, toChatId, messageIds, {
      silent,
      dropAuthor,
      dropMediaCaptions
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['fromChatId', 'toChatId', 'messageIds']
  }
);
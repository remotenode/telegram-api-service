import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, messageId } = req.body;

    if (!chatId || !messageId) {
      throw new Error('Chat ID and Message ID are required');
    }

    return await telegramService.message.getMessageReactions(chatId, messageId);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId']
  }
);

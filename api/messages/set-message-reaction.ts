import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, messageId, reaction } = req.body;

    if (!chatId || !messageId) {
      throw new Error('Chat ID and Message ID are required');
    }

    return await telegramService.message.setMessageReaction(chatId, messageId, reaction);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId']
  }
);

import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, messageId, silent, unpin, pmOneside } = req.body;

    if (!chatId || !messageId) {
      throw new Error('chatId and messageId are required');
    }

    return await telegramService.message.pinMessage(chatId, messageId, {
      silent,
      unpin,
      pmOneside
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId']
  }
);

import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, action = 'typing' } = req.body;

    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    return await telegramService.message.sendTyping(chatId, action);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId']
  }
);

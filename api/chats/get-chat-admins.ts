import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId } = req.body;

    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    return await telegramService.chat.getChatAdmins(chatId);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId']
  }
);

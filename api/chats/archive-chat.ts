import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, archive = true } = req.body;

    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    return await telegramService.chat.archiveChat(chatId, archive);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId']
  }
);

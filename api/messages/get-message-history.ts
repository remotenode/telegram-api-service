import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      limit = 100, 
      offsetId, 
      offsetDate, 
      addOffset, 
      maxId, 
      minId 
    } = req.body;

    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    return await telegramService.message.getMessageHistory(chatId, limit, offsetId);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId']
  }
);

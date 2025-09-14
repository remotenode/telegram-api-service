import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      messageId, 
      newMessage, 
      parseMode, 
      linkPreview, 
      replyMarkup 
    } = req.body;

    if (!chatId || !messageId || !newMessage) {
      throw new Error('chatId, messageId, and newMessage are required');
    }

    return await telegramService.message.editMessage(chatId, messageId, newMessage, {
      parseMode,
      linkPreview,
      replyMarkup
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId', 'newMessage']
  }
);

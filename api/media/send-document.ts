import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      document, 
      filename, 
      caption, 
      parseMode, 
      replyTo, 
      silent, 
      scheduleDate, 
      thumb, 
      progressCallback 
    } = req.body;

    if (!chatId || !document) {
      throw new Error('chatId and document are required');
    }

    return await telegramService.media.sendDocument(chatId, document, {
      filename,
      caption,
      parseMode,
      replyTo,
      silent,
      scheduleDate,
      thumb,
      progressCallback
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'document']
  }
);

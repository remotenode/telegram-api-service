import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      files, 
      captions, 
      replyTo, 
      silent = false 
    } = req.body;

    if (!chatId || !files || !Array.isArray(files)) {
      throw new Error('Chat ID and files array are required');
    }

    return await telegramService.media.sendAlbum(chatId, files, {
      captions,
      replyTo,
      silent
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'files']
  }
);

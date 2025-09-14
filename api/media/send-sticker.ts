import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      sticker, 
      replyTo, 
      silent = false 
    } = req.body;

    if (!chatId || !sticker) {
      throw new Error('Chat ID and sticker are required');
    }

    return await telegramService.media.sendSticker(chatId, sticker, {
      replyTo,
      silent
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'sticker']
  }
);

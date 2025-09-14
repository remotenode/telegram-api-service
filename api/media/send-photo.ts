import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, photo, caption, parseMode, replyTo, silent, scheduleDate, compress } = req.body;

    if (!chatId || !photo) {
      throw new Error('chatId and photo are required');
    }

    return await telegramService.media.sendPhoto(chatId, photo, {
      caption,
      parseMode,
      replyTo,
      silent,
      scheduleDate,
      compress
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'photo']
  }
);

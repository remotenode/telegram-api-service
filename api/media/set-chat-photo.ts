import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, photo } = req.body;

    if (!chatId || !photo) {
      throw new Error('chatId and photo are required');
    }

    return await telegramService.media.setChatPhoto(chatId, photo);
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'photo']
  }
);

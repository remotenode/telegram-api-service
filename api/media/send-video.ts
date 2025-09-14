import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      video, 
      caption, 
      duration, 
      width, 
      height, 
      thumb, 
      replyTo, 
      silent = false 
    } = req.body;

    if (!chatId || !video) {
      throw new Error('Chat ID and video are required');
    }

    return await telegramService.media.sendVideo(chatId, video, {
      caption,
      duration,
      width,
      height,
      thumb,
      replyTo,
      silent
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'video']
  }
);

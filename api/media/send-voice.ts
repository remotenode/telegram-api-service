import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { 
      chatId, 
      voice, 
      duration, 
      waveform, 
      replyTo, 
      silent = false 
    } = req.body;

    if (!chatId || !voice) {
      throw new Error('Chat ID and voice are required');
    }

    return await telegramService.media.sendVoice(chatId, voice, {
      duration,
      waveform,
      replyTo,
      silent
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'voice']
  }
);

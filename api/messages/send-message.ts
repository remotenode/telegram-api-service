import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { chatId, message, replyTo, parseMode, linkPreview, silent, scheduleDate } = req.body;

    if (!chatId || !message) {
      throw new Error('Chat ID and message are required in request body');
    }

    return await telegramService.message.sendMessage(chatId, message, {
      replyTo,
      parseMode,
      linkPreview,
      silent,
      scheduleDate
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['chatId', 'message']
  }
);

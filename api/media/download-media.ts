import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { messageOrMedia, outputPath, progressCallback } = req.body;

    if (!messageOrMedia) {
      throw new Error('messageOrMedia is required');
    }

    return await telegramService.media.downloadMedia(messageOrMedia, {
      outputPath,
      progressCallback
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['messageOrMedia']
  }
);

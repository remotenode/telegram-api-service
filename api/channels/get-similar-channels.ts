import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { channelId, limit = 10 } = req.body;

    if (!channelId) {
      throw new Error('Channel ID is required in request body');
    }

    return await telegramService.getSimilarChannels(channelId, limit);
  },
  {
    requireBody: true,
    requiredBodyFields: ['channelId']
  }
);

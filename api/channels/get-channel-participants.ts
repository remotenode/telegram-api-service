import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { channelId, filter, offset = 0, limit = 100, hash = 0 } = req.body;

    if (!channelId) {
      throw new Error('Channel ID is required');
    }

    return await telegramService.channel.getChannelParticipants(channelId, {
      filter,
      offset,
      limit,
      hash
    });
  },
  {
    requireBody: true,
    requiredBodyFields: ['channelId']
  }
);
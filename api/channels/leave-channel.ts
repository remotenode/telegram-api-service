import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { channelId } = req.body;

    if (!channelId) {
      throw new Error('Channel ID is required');
    }

    return await telegramService.channel.leaveChannel(channelId);
  },
  {
    requireBody: true,
    requiredBodyFields: ['channelId']
  }
);
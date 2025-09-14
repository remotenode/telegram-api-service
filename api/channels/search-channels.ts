import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { query, limit = 20 } = req.body;

    if (!query) {
      throw new Error('Search query is required in request body');
    }

    return await telegramService.channel.searchChannels(query, limit);
  },
  {
    requireBody: true,
    requiredBodyFields: ['query']
  }
);

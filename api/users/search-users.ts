import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { query, limit = 20 } = req.body;

    if (!query) {
      throw new Error('Search query is required');
    }

    return await telegramService.user.searchUsers(query, limit);
  },
  {
    requireBody: true,
    requiredBodyFields: ['query']
  }
);

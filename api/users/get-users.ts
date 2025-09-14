import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error('User IDs array is required in request body');
    }

    return await telegramService.user.getUsers(ids);
  },
  {
    requireBody: true,
    requiredBodyFields: ['ids']
  }
);

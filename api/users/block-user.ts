import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { userId } = req.body;

    if (!userId) {
      throw new Error('User ID is required');
    }

    return await telegramService.user.blockUser(userId);
  },
  {
    requireBody: true,
    requiredBodyFields: ['userId']
  }
);

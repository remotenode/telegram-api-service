import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { userId: targetUserId, limit = 10 } = req.body;

    if (!targetUserId) {
      throw new Error('User ID is required in request body');
    }

    return await telegramService.user.getUserPhotos(targetUserId, limit);
  },
  {
    requireBody: true,
    requiredBodyFields: ['userId']
  }
);

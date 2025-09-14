import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { title, users, about } = req.body;

    if (!title || !users || !Array.isArray(users)) {
      throw new Error('title and users array are required');
    }

    return await telegramService.chat.createGroup(title, users, about);
  },
  {
    requireBody: true,
    requiredBodyFields: ['title', 'users']
  }
);

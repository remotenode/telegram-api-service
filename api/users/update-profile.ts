import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { firstName, lastName, about } = req.body;
    return await telegramService.user.updateProfile({
      firstName,
      lastName,
      about
    });
  }
);

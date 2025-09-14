import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { slug } = req.body;

    if (!slug) {
      throw new Error('Gift code slug is required');
    }

    return await telegramService.payment.checkGiftCode(slug);
  },
  {
    requireBody: true,
    requiredBodyFields: ['slug']
  }
);

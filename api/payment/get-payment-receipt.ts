import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { msgId, peer } = req.body;

    if (!msgId) {
      throw new Error('Message ID is required');
    }

    return await telegramService.payment.getPaymentReceipt(msgId, peer);
  },
  {
    requireBody: true,
    requiredBodyFields: ['msgId']
  }
);

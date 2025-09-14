import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { invoice } = req.body;

    if (!invoice) {
      throw new Error('invoice is required');
    }

    return await telegramService.payment.getPaymentForm(invoice);
  },
  {
    requireBody: true,
    requiredBodyFields: ['invoice']
  }
);

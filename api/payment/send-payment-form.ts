import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { formId, invoice, requestedInfoId, shippingOptionId, credentials, tipAmount } = req.body;

    if (!formId || !invoice) {
      throw new Error('formId and invoice are required');
    }

    return await telegramService.payment.sendPaymentForm(
      formId, 
      invoice, 
      requestedInfoId, 
      shippingOptionId, 
      credentials, 
      tipAmount
    );
  },
  {
    requireBody: true,
    requiredBodyFields: ['formId', 'invoice']
  }
);

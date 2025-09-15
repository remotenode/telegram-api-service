"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { formId, invoice, requestedInfoId, shippingOptionId, credentials, tipAmount } = req.body;
    if (!formId || !invoice) {
        throw new Error('formId and invoice are required');
    }
    return await telegramService.payment.sendPaymentForm(formId, invoice, requestedInfoId, shippingOptionId, credentials, tipAmount);
}, {
    requireBody: true,
    requiredBodyFields: ['formId', 'invoice']
});
//# sourceMappingURL=send-payment-form.js.map
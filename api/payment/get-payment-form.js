"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { invoice } = req.body;
    if (!invoice) {
        throw new Error('invoice is required');
    }
    return await telegramService.payment.getPaymentForm(invoice);
}, {
    requireBody: true,
    requiredBodyFields: ['invoice']
});
//# sourceMappingURL=get-payment-form.js.map
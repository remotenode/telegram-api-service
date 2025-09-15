"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { msgId, peer } = req.body;
    if (!msgId) {
        throw new Error('Message ID is required');
    }
    return await telegramService.payment.getPaymentReceipt(msgId, peer);
}, {
    requireBody: true,
    requiredBodyFields: ['msgId']
});
//# sourceMappingURL=get-payment-receipt.js.map
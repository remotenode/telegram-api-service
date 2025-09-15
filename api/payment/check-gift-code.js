"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { slug } = req.body;
    if (!slug) {
        throw new Error('Gift code slug is required');
    }
    return await telegramService.payment.checkGiftCode(slug);
}, {
    requireBody: true,
    requiredBodyFields: ['slug']
});
//# sourceMappingURL=check-gift-code.js.map
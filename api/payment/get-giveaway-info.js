"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { peer, msgId } = req.body;
    if (!peer || !msgId) {
        throw new Error('peer and msgId are required');
    }
    return await telegramService.payment.getGiveawayInfo(peer, msgId);
}, {
    requireBody: true,
    requiredBodyFields: ['peer', 'msgId']
});
//# sourceMappingURL=get-giveaway-info.js.map
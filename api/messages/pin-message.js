"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, messageId, silent, unpin, pmOneside } = req.body;
    if (!chatId || !messageId) {
        throw new Error('chatId and messageId are required');
    }
    return await telegramService.message.pinMessage(chatId, messageId, {
        silent,
        unpin,
        pmOneside
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId']
});
//# sourceMappingURL=pin-message.js.map
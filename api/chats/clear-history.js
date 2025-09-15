"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, revoke = false } = req.body;
    if (!chatId) {
        throw new Error('Chat ID is required');
    }
    return await telegramService.chat.clearHistory(chatId, { revoke });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId']
});
//# sourceMappingURL=clear-history.js.map
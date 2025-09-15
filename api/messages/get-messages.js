"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, limit = 100, offsetId, offsetDate, addOffset, maxId, minId, search, fromUser } = req.body;
    if (!chatId) {
        throw new Error('Chat ID is required');
    }
    // For now, use getMessageHistory with basic parameters
    // TODO: Implement advanced filtering in messageOperations
    return await telegramService.message.getMessageHistory(chatId, limit, offsetId);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId']
});
//# sourceMappingURL=get-messages.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, messageIds, revoke = true } = req.body;
    if (!chatId || !messageIds || !Array.isArray(messageIds)) {
        throw new Error('chatId and messageIds array are required');
    }
    return await telegramService.message.deleteMessages(chatId, messageIds, revoke);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageIds']
});
//# sourceMappingURL=delete-messages.js.map
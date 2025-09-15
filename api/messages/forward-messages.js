"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { fromChatId, toChatId, messageIds, silent, dropAuthor, dropMediaCaptions } = req.body;
    if (!fromChatId || !toChatId || !messageIds || !Array.isArray(messageIds)) {
        throw new Error('fromChatId, toChatId, and messageIds array are required');
    }
    return await telegramService.message.forwardMessages(fromChatId, toChatId, messageIds, {
        silent,
        dropAuthor,
        dropMediaCaptions
    });
}, {
    requireBody: true,
    requiredBodyFields: ['fromChatId', 'toChatId', 'messageIds']
});
//# sourceMappingURL=forward-messages.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, messageId } = req.body;
    if (!chatId || !messageId) {
        throw new Error('Chat ID and Message ID are required');
    }
    return await telegramService.message.getMessageReactions(chatId, messageId);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId']
});
//# sourceMappingURL=get-message-reactions.js.map
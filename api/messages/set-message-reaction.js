"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, messageId, reaction } = req.body;
    if (!chatId || !messageId) {
        throw new Error('Chat ID and Message ID are required');
    }
    return await telegramService.message.setMessageReaction(chatId, messageId, reaction);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId']
});
//# sourceMappingURL=set-message-reaction.js.map
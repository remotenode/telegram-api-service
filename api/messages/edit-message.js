"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, messageId, newMessage, parseMode, linkPreview, replyMarkup } = req.body;
    if (!chatId || !messageId || !newMessage) {
        throw new Error('chatId, messageId, and newMessage are required');
    }
    return await telegramService.message.editMessage(chatId, messageId, newMessage, {
        parseMode,
        linkPreview,
        replyMarkup
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'messageId', 'newMessage']
});
//# sourceMappingURL=edit-message.js.map
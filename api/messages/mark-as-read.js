"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, messageIds } = req.body;
    if (!chatId) {
        throw new Error('Chat ID is required');
    }
    return await telegramService.message.markAsRead(chatId, messageIds);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId']
});
//# sourceMappingURL=mark-as-read.js.map
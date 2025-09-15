"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, reason, comment } = req.body;
    if (!chatId || !reason) {
        throw new Error('Chat ID and reason are required');
    }
    return await telegramService.chat.reportChat(chatId, reason, comment);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'reason']
});
//# sourceMappingURL=report-chat.js.map
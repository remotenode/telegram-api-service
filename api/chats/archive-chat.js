"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, archive = true } = req.body;
    if (!chatId) {
        throw new Error('Chat ID is required');
    }
    return await telegramService.chat.archiveChat(chatId, archive);
}, {
    requireBody: true,
    requiredBodyFields: ['chatId']
});
//# sourceMappingURL=archive-chat.js.map
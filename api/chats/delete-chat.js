"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, revoke, deleteForAll } = req.body;
    if (!chatId) {
        throw new Error('Chat ID is required');
    }
    return await telegramService.chat.deleteChat(chatId, {
        revoke,
        deleteForAll
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId']
});
//# sourceMappingURL=delete-chat.js.map
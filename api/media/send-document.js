"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, document, filename, caption, parseMode, replyTo, silent, scheduleDate, thumb, progressCallback } = req.body;
    if (!chatId || !document) {
        throw new Error('chatId and document are required');
    }
    return await telegramService.media.sendDocument(chatId, document, {
        filename,
        caption,
        parseMode,
        replyTo,
        silent,
        scheduleDate,
        thumb,
        progressCallback
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'document']
});
//# sourceMappingURL=send-document.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, files, captions, replyTo, silent = false } = req.body;
    if (!chatId || !files || !Array.isArray(files)) {
        throw new Error('Chat ID and files array are required');
    }
    return await telegramService.media.sendAlbum(chatId, files, {
        captions,
        replyTo,
        silent
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'files']
});
//# sourceMappingURL=send-album.js.map
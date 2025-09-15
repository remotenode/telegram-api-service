"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, sticker, replyTo, silent = false } = req.body;
    if (!chatId || !sticker) {
        throw new Error('Chat ID and sticker are required');
    }
    return await telegramService.media.sendSticker(chatId, sticker, {
        replyTo,
        silent
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'sticker']
});
//# sourceMappingURL=send-sticker.js.map
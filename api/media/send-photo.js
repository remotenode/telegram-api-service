"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, photo, caption, parseMode, replyTo, silent, scheduleDate, compress } = req.body;
    if (!chatId || !photo) {
        throw new Error('chatId and photo are required');
    }
    return await telegramService.media.sendPhoto(chatId, photo, {
        caption,
        parseMode,
        replyTo,
        silent,
        scheduleDate,
        compress
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'photo']
});
//# sourceMappingURL=send-photo.js.map
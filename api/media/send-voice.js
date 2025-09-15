"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, voice, duration, waveform, replyTo, silent = false } = req.body;
    if (!chatId || !voice) {
        throw new Error('Chat ID and voice are required');
    }
    return await telegramService.media.sendVoice(chatId, voice, {
        duration,
        waveform,
        replyTo,
        silent
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'voice']
});
//# sourceMappingURL=send-voice.js.map
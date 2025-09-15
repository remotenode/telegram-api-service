"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
/**
 * @summary Send Message
 * @description Send a message to a user or channel
 * @param {string} chatId - Chat ID to send message to
 * @param {string} message - Message text to send
 * @param {number} [replyTo] - Message ID to reply to (optional)
 * @param {string} [parseMode] - Parse mode: 'md' or 'html' (optional)
 * @param {boolean} [linkPreview] - Enable link preview (optional)
 * @param {boolean} [silent] - Send message silently (optional)
 * @param {number} [scheduleDate] - Schedule message for later (optional)
 */
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { chatId, message, replyTo, parseMode, linkPreview, silent, scheduleDate } = req.body;
    if (!chatId || !message) {
        throw new Error('Chat ID and message are required in request body');
    }
    return await telegramService.message.sendMessage(chatId, message, {
        replyTo,
        parseMode,
        linkPreview,
        silent,
        scheduleDate
    });
}, {
    requireBody: true,
    requiredBodyFields: ['chatId', 'message']
});
//# sourceMappingURL=send-message.js.map
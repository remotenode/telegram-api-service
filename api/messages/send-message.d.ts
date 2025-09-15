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
declare const _default: (req: import("@vercel/node").VercelRequest, res: import("@vercel/node").VercelResponse) => Promise<void>;
export default _default;
//# sourceMappingURL=send-message.d.ts.map
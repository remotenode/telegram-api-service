"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
/**
 * @summary Validate Session
 * @description Validate Telegram session and get user information
 */
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService) => {
    return await telegramService.validateSession();
}, {
    corsHeaders: false // This endpoint doesn't need CORS headers
});
//# sourceMappingURL=validate-session.js.map
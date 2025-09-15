"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
/**
 * @summary Get Users
 * @description Get user information by user IDs
 * @param {string[]} ids - Array of user IDs to retrieve
 */
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error('User IDs array is required in request body');
    }
    return await telegramService.user.getUsers(ids);
}, {
    requireBody: true,
    requiredBodyFields: ['ids']
});
//# sourceMappingURL=get-users.js.map
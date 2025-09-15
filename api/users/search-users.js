"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { query, limit = 20 } = req.body;
    if (!query) {
        throw new Error('Search query is required');
    }
    return await telegramService.user.searchUsers(query, limit);
}, {
    requireBody: true,
    requiredBodyFields: ['query']
});
//# sourceMappingURL=search-users.js.map
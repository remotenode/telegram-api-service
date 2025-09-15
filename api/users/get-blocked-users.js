"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { limit = 100 } = req.body;
    return await telegramService.user.getBlockedUsers(limit);
});
//# sourceMappingURL=get-blocked-users.js.map
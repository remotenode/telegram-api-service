"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { userId } = req.body;
    if (!userId) {
        throw new Error('User ID is required');
    }
    return await telegramService.user.blockUser(userId);
}, {
    requireBody: true,
    requiredBodyFields: ['userId']
});
//# sourceMappingURL=block-user.js.map
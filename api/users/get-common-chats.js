"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { userId, maxId = 0 } = req.body;
    if (!userId) {
        throw new Error('User ID is required');
    }
    return await telegramService.user.getCommonChats(userId, maxId);
}, {
    requireBody: true,
    requiredBodyFields: ['userId']
});
//# sourceMappingURL=get-common-chats.js.map
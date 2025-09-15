"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { userId: targetUserId, limit = 10 } = req.body;
    if (!targetUserId) {
        throw new Error('User ID is required in request body');
    }
    return await telegramService.user.getUserPhotos(targetUserId, limit);
}, {
    requireBody: true,
    requiredBodyFields: ['userId']
});
//# sourceMappingURL=get-user-photos.js.map
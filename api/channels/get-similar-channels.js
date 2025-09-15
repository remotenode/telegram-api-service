"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { channelId, limit = 10 } = req.body;
    if (!channelId) {
        throw new Error('Channel ID is required in request body');
    }
    return await telegramService.getSimilarChannels(channelId, limit);
}, {
    requireBody: true,
    requiredBodyFields: ['channelId']
});
//# sourceMappingURL=get-similar-channels.js.map
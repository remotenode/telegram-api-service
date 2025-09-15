"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { channelId, filter, offset = 0, limit = 100, hash = 0 } = req.body;
    if (!channelId) {
        throw new Error('Channel ID is required');
    }
    return await telegramService.channel.getChannelParticipants(channelId, {
        filter,
        offset,
        limit,
        hash
    });
}, {
    requireBody: true,
    requiredBodyFields: ['channelId']
});
//# sourceMappingURL=get-channel-participants.js.map
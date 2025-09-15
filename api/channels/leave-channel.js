"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { channelId } = req.body;
    if (!channelId) {
        throw new Error('Channel ID is required');
    }
    return await telegramService.channel.leaveChannel(channelId);
}, {
    requireBody: true,
    requiredBodyFields: ['channelId']
});
//# sourceMappingURL=leave-channel.js.map
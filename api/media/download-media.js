"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { messageOrMedia, outputPath, progressCallback } = req.body;
    if (!messageOrMedia) {
        throw new Error('messageOrMedia is required');
    }
    return await telegramService.media.downloadMedia(messageOrMedia, {
        outputPath,
        progressCallback
    });
}, {
    requireBody: true,
    requiredBodyFields: ['messageOrMedia']
});
//# sourceMappingURL=download-media.js.map
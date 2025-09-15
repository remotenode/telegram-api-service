"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { title, users, about } = req.body;
    if (!title || !users || !Array.isArray(users)) {
        throw new Error('title and users array are required');
    }
    return await telegramService.chat.createGroup(title, users, about);
}, {
    requireBody: true,
    requiredBodyFields: ['title', 'users']
});
//# sourceMappingURL=create-group.js.map
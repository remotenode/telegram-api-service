"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHandler_1 = require("../../src/utils/apiHandler");
exports.default = (0, apiHandler_1.createApiHandler)(async (telegramService, req) => {
    const { firstName, lastName, about } = req.body;
    return await telegramService.user.updateProfile({
        firstName,
        lastName,
        about
    });
});
//# sourceMappingURL=update-profile.js.map
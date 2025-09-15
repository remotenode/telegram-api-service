"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const advanced_generator_1 = require("../../src/docs/advanced-generator");
async function handler(req, res) {
    try {
        const generator = new advanced_generator_1.AdvancedApiDocGenerator();
        const spec = generator.generateOpenAPISpec();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(200).json(spec);
    }
    catch (error) {
        console.error('Error generating API docs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate API documentation'
        });
    }
}
//# sourceMappingURL=auto-generated.js.map
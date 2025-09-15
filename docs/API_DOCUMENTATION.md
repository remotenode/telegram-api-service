# Automated API Documentation System

This project now uses an **automated API documentation generation system** that eliminates the need for manual OpenAPI spec maintenance.

## 🚀 How It Works

The system automatically:
1. **Scans all API handlers** in the `api/` directory
2. **Extracts JSDoc comments** for parameter descriptions
3. **Generates OpenAPI 3.0 specification** automatically
4. **Creates response schemas** based on actual operation return types
5. **Updates documentation** whenever code changes

## 📝 Adding Documentation to New Endpoints

Simply add JSDoc comments to your API handler files:

```typescript
/**
 * @summary Send Message
 * @description Send a message to a user or channel
 * @param {string} chatId - Chat ID to send message to
 * @param {string} message - Message text to send
 * @param {number} [replyTo] - Message ID to reply to (optional)
 * @param {string} [parseMode] - Parse mode: 'md' or 'html' (optional)
 */
export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    // Your handler code here
  }
);
```

## 🛠️ Commands

### Generate Documentation
```bash
npm run docs:generate
```
This command:
- Scans all API handlers
- Generates OpenAPI spec
- Saves to `src/openapi-auto-generated.json`

### Serve Documentation Locally
```bash
npm run docs:serve
```
Starts local development server with auto-generated docs.

## 🌐 Live Documentation Endpoints

### Auto-Generated OpenAPI Spec
- **Raw JSON**: https://telegram-api.aso.market/api/docs/auto-generated
- **Swagger UI**: https://telegram-api.aso.market/api/docs/swagger-auto
- **ReDoc**: https://telegram-api.aso.market/api/docs/redoc-auto

### Legacy Manual Documentation
- **Swagger UI**: https://telegram-api.aso.market/api/swagger
- **ReDoc**: https://telegram-api.aso.market/api/redoc-comprehensive

## 🔧 Technical Details

### File Structure
```
src/docs/
├── generator.ts              # Basic generator
├── advanced-generator.ts     # Advanced generator with operation scanning
└── openapi-auto-generated.json # Generated OpenAPI spec

api/docs/
├── auto-generated.ts         # Endpoint serving raw OpenAPI JSON
├── swagger-auto.ts          # Swagger UI for auto-generated docs
└── redoc-auto.ts            # ReDoc for auto-generated docs

scripts/
└── generate-docs.ts          # CLI script for generating docs
```

### Features
- ✅ **Automatic endpoint discovery** from file structure
- ✅ **JSDoc parameter extraction** for request bodies
- ✅ **Response schema mapping** based on operation types
- ✅ **Tag generation** from directory structure
- ✅ **Standard Telegram auth headers** automatically added
- ✅ **Error response schemas** for all endpoints
- ✅ **TypeScript support** with proper type mapping

### Supported JSDoc Tags
- `@summary` - Endpoint summary
- `@description` - Detailed description
- `@param {type} name - description` - Request body parameters

### Type Mapping
- `string` → `string`
- `number` → `number`
- `boolean` → `boolean`
- `object` → `object`
- `array` → `array`
- `string[]` → `array`

## 🎯 Benefits

1. **No Manual Maintenance** - Documentation updates automatically
2. **Always Accurate** - Generated from actual code
3. **Consistent Format** - All endpoints follow same structure
4. **Easy to Use** - Just add JSDoc comments
5. **Version Controlled** - Documentation is part of codebase
6. **Multiple Formats** - Swagger UI, ReDoc, and raw JSON

## 🔄 Workflow

1. **Add new API endpoint** in `api/` directory
2. **Add JSDoc comments** with parameter descriptions
3. **Run `npm run docs:generate`** to update documentation
4. **Commit and deploy** - documentation updates automatically

## 📊 Current Status

- **Total Endpoints**: 55+
- **Auto-Generated**: ✅ All endpoints
- **JSDoc Coverage**: 🔄 In progress (add comments as needed)
- **Response Schemas**: ✅ All mapped to actual return types

---

**No more manual OpenAPI spec maintenance required!** 🎉

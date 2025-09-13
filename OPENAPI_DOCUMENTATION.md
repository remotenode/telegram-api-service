# OpenAPI & Swagger Documentation

## Overview

The Telegram API Service now includes comprehensive API documentation using OpenAPI 3.0 specification and multiple documentation viewers.

## Available Documentation Endpoints

### 1. **API Landing Page** - `/` or `/api`
A beautiful landing page that provides:
- Overview of the service
- Links to all documentation options
- Quick start guide
- Technology stack information

### 2. **Swagger UI** - `/api/docs` or `/docs`
Interactive API documentation with:
- Try-it-out functionality
- Request/response examples
- Schema definitions
- Live API testing

### 3. **ReDoc** - `/api/redoc` or `/redoc`
Clean, responsive documentation featuring:
- Three-panel layout
- Easy navigation
- Code samples
- Print-friendly format

### 4. **OpenAPI Specification** - `/api/openapi`
Raw OpenAPI 3.0 spec in JSON format:
- Machine-readable format
- Import into API tools
- CORS-enabled for external access
- Automatically updates server URL

## Files Structure

```
/workspace/
├── openapi.yaml                 # OpenAPI spec in YAML format
├── src/openapi.json            # OpenAPI spec in JSON format (used by endpoints)
├── postman-collection.json     # Postman collection for easy import
├── API_EXAMPLES.md             # Code examples in multiple languages
├── api/
│   ├── index.ts               # Landing page endpoint
│   ├── docs.ts                # Swagger UI endpoint
│   ├── redoc.ts               # ReDoc endpoint
│   └── openapi.ts             # OpenAPI spec endpoint
```

## OpenAPI Specification Features

### Comprehensive Schema Definitions
- Request/response schemas for all endpoints
- Shared component schemas (TelegramCredentials, TelegramChannel, etc.)
- Detailed property descriptions
- Required field validations

### Rich Examples
- Multiple request examples per endpoint
- Success and error response examples
- Real-world use cases

### API Metadata
- Contact information
- License details
- Server configurations
- Tag-based organization

## Key Features Implemented

### 1. **Auto-updating Server URLs**
The OpenAPI spec automatically updates the server URL based on the current host, making it work seamlessly across different deployments.

### 2. **CORS Support**
All documentation endpoints include proper CORS headers for cross-origin access.

### 3. **Multiple Formats**
- YAML format for human readability
- JSON format for programmatic access
- Postman collection for API testing

### 4. **Rich Documentation**
- Detailed descriptions for all operations
- Parameter constraints and validations
- Response schema documentation
- Error response examples

## Using the Documentation

### For API Consumers
1. Visit `/api/docs` for interactive testing
2. Use `/api/redoc` for detailed reference
3. Import `postman-collection.json` into Postman

### For Developers
1. Import `/api/openapi` into your API tools
2. Generate client SDKs from the OpenAPI spec
3. Use the spec for API validation and testing

### For Integration
```javascript
// Fetch the OpenAPI spec
const response = await fetch('https://your-app.vercel.app/api/openapi');
const spec = await response.json();

// Use with OpenAPI tools
const SwaggerParser = require('@apidevtools/swagger-parser');
const api = await SwaggerParser.validate(spec);
```

## Postman Collection

The `postman-collection.json` includes:
- Pre-configured requests for all endpoints
- Environment variables for easy configuration
- Request examples with proper formatting
- Collection-level documentation

To use:
1. Open Postman
2. Import > Upload Files > Select `postman-collection.json`
3. Configure environment variables
4. Start making requests

## Code Examples

The `API_EXAMPLES.md` file provides examples in:
- cURL
- JavaScript (Fetch)
- Node.js (Axios)
- Python (Requests)

Each example includes:
- Complete request format
- Required headers
- Response handling
- Error handling

## Benefits

1. **Better Developer Experience**: Interactive documentation makes API exploration easy
2. **Reduced Support**: Self-service documentation reduces support requests
3. **Faster Integration**: Code examples and Postman collection speed up integration
4. **API Validation**: OpenAPI spec enables request/response validation
5. **SDK Generation**: Generate client libraries in any language from the spec

## Future Enhancements

Consider adding:
- API versioning in the spec
- Webhook documentation (if applicable)
- Rate limiting documentation
- Authentication schemes (when implemented)
- Response time expectations
- WebSocket endpoints (if added)
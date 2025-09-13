# Telegram API Service - Code Examples

## Base URL
```
https://your-vercel-app.vercel.app
```

## Authentication
All endpoints require Telegram API credentials to be passed in the request body:
- `apiId` - Your Telegram API ID from my.telegram.org
- `apiHash` - Your Telegram API Hash from my.telegram.org
- `sessionString` - A valid Telegram session string
- `userId` - Your Telegram user ID

## Endpoints

### 1. Validate Session

Validates a Telegram session and returns user information.

#### cURL
```bash
curl -X POST https://your-vercel-app.vercel.app/api/validate-session \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "main",
    "apiId": 12345,
    "apiHash": "your-api-hash",
    "sessionString": "your-session-string",
    "userId": "123456789"
  }'
```

#### JavaScript (Fetch)
```javascript
const response = await fetch('https://your-vercel-app.vercel.app/api/validate-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    accountType: 'main',
    apiId: 12345,
    apiHash: 'your-api-hash',
    sessionString: 'your-session-string',
    userId: '123456789'
  })
});

const data = await response.json();
console.log(data);
```

#### Python
```python
import requests

url = "https://your-vercel-app.vercel.app/api/validate-session"
payload = {
    "accountType": "main",
    "apiId": 12345,
    "apiHash": "your-api-hash",
    "sessionString": "your-session-string",
    "userId": "123456789"
}

response = requests.post(url, json=payload)
data = response.json()
print(data)
```

#### Node.js (Axios)
```javascript
const axios = require('axios');

const config = {
  method: 'post',
  url: 'https://your-vercel-app.vercel.app/api/validate-session',
  headers: { 
    'Content-Type': 'application/json'
  },
  data: {
    accountType: 'main',
    apiId: 12345,
    apiHash: 'your-api-hash',
    sessionString: 'your-session-string',
    userId: '123456789'
  }
};

axios(config)
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

#### Response Example (Success)
```json
{
  "success": true,
  "isValid": true,
  "userInfo": {
    "id": "123456789",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "is_bot": false,
    "is_premium": true,
    "phone": "+1234567890",
    "about": "Hello, I'm using Telegram!",
    "profile_photo": {
      "id": "5195767158976957794",
      "dc_id": 2
    },
    "common_chats_count": 5,
    "blocked": false,
    "can_pin_message": true,
    "has_private_forwards": false,
    "settings": {
      "report_spam": true,
      "add_contact": true,
      "block_contact": true,
      "share_contact": true,
      "report_geo": true
    }
  }
}
```

### 2. Get Similar Channels

Returns channels similar to a specified channel.

#### cURL
```bash
curl -X POST https://your-vercel-app.vercel.app/api/get-similar-channels \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "@channelname",
    "limit": 10,
    "accountType": "main",
    "apiId": 12345,
    "apiHash": "your-api-hash",
    "sessionString": "your-session-string",
    "userId": "123456789"
  }'
```

#### JavaScript (Fetch)
```javascript
const response = await fetch('https://your-vercel-app.vercel.app/api/get-similar-channels', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    channelId: '@channelname',
    limit: 10,
    accountType: 'main',
    apiId: 12345,
    apiHash: 'your-api-hash',
    sessionString: 'your-session-string',
    userId: '123456789'
  })
});

const data = await response.json();
console.log(data);
```

#### Python
```python
import requests

url = "https://your-vercel-app.vercel.app/api/get-similar-channels"
payload = {
    "channelId": "@channelname",
    "limit": 10,
    "accountType": "main",
    "apiId": 12345,
    "apiHash": "your-api-hash",
    "sessionString": "your-session-string",
    "userId": "123456789"
}

response = requests.post(url, json=payload)
data = response.json()
print(data)
```

#### Response Example (Success)
```json
{
  "success": true,
  "channels": [
    {
      "id": "1234567890",
      "title": "Tech News Channel",
      "username": "technews",
      "description": "Latest technology news and updates",
      "participants_count": 15000,
      "is_verified": true,
      "is_scam": false,
      "is_fake": false,
      "type": "channel"
    },
    {
      "id": "0987654321",
      "title": "Gadget Reviews",
      "username": "gadgetreviews",
      "description": "In-depth reviews of the latest gadgets",
      "participants_count": 8500,
      "is_verified": false,
      "is_scam": false,
      "is_fake": false,
      "type": "channel"
    }
  ]
}
```

## Error Handling

All endpoints return consistent error responses:

### Missing Required Fields (400)
```json
{
  "success": false,
  "error": "Missing required fields: accountType, apiId, apiHash, sessionString"
}
```

### Invalid Session (400)
```json
{
  "success": false,
  "error": "Valid session string is required."
}
```

### Channel Not Found (200 with error)
```json
{
  "success": false,
  "error": "Channel not found"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Rate Limiting

Currently, rate limiting is not implemented at the API level. It's recommended to implement rate limiting at the client level or use a proxy service.

## Best Practices

1. **Session Management**: Store session strings securely and never expose them in client-side code.
2. **Error Handling**: Always check the `success` field before processing the response.
3. **Limits**: Be reasonable with the `limit` parameter to avoid timeouts.
4. **Channel IDs**: You can use either channel usernames (e.g., "@channelname") or numeric IDs.

## SDK Usage

If you're building a TypeScript/JavaScript application, you can use the service directly:

```typescript
import { TelegramService } from '@your-org/telegram-api-service';

const telegram = new TelegramService({
  apiId: 12345,
  apiHash: 'your-api-hash',
  sessionString: 'your-session-string',
  userId: '123456789'
});

// Validate session
const session = await telegram.validateSession();

// Get similar channels
const channels = await telegram.channel.getSimilarChannels('@channelname', 10);

// Don't forget to disconnect
await telegram.disconnect();
```
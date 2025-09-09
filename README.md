# Telegram API Service

A Vercel-based service that provides real Telegram API integration using gramjs for the gift monitoring system.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Cloudflare      │    │ Vercel Service   │    │ Telegram        │
│ Worker          │───▶│ (gramjs/MTProto) │───▶│ API             │
│ (Monitoring)    │    │ (Real API calls) │    │ (User accounts) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Features

- **Real Telegram Integration**: Uses gramjs for MTProto protocol
- **Gift Sending**: Send gifts to users and channels
- **Balance Checking**: Get account balance
- **Session Validation**: Validate Telegram sessions
- **Gift Management**: Get available and received gifts

## 📡 API Endpoints

### POST `/api/send-gift`
Send a gift to a user or channel.

**Request Body:**
```json
{
  "recipientId": "123456789",
  "giftId": "gift_123",
  "isChannel": false,
  "accountType": "main",
  "apiId": 24253232,
  "apiHash": "d97a2ffae0a841a238284860378c35ab",
  "sessionString": "your-session-string",
  "userId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "12345"
}
```

### POST `/api/get-gifts`
Get available gifts for an account.

**Request Body:**
```json
{
  "accountType": "main",
  "apiId": 24253232,
  "apiHash": "d97a2ffae0a841a238284860378c35ab",
  "sessionString": "your-session-string",
  "userId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "gifts": [
    {
      "id": "gift_1",
      "gift_type": "Star",
      "stars": 1,
      "availability": 100
    }
  ]
}
```

### POST `/api/get-balance`
Get account balance.

**Request Body:**
```json
{
  "accountType": "main",
  "apiId": 24253232,
  "apiHash": "d97a2ffae0a841a238284860378c35ab",
  "sessionString": "your-session-string",
  "userId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "balance": {
    "stars": 50
  }
}
```

### POST `/api/validate-session`
Validate a Telegram session.

**Request Body:**
```json
{
  "accountType": "main",
  "apiId": 24253232,
  "apiHash": "d97a2ffae0a841a238284860378c35ab",
  "sessionString": "your-session-string",
  "userId": "123456789"
}
```

**Response:**
```json
{
  "success": true,
  "isValid": true,
  "userInfo": {
    "id": "123456789",
    "username": "username",
    "first_name": "John",
    "is_bot": false,
    "is_premium": true
  }
}
```

### POST `/api/get-received-gifts`
Get received gifts for a user.

**Request Body:**
```json
{
  "accountType": "pull",
  "apiId": 25072862,
  "apiHash": "e494cd2e650002434b55deff94c24d0a",
  "sessionString": "your-session-string",
  "userId": "123456789",
  "targetUserId": "987654321"
}
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Vercel CLI

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

## 🔧 Configuration

The service expects the following environment variables (passed in request body):
- `apiId`: Telegram API ID
- `apiHash`: Telegram API Hash
- `sessionString`: Telegram session string
- `userId`: Telegram user ID
- `accountType`: Account type ("main" or "pull")

## 🔒 Security

- All API calls require proper authentication
- Session strings are validated before use
- Rate limiting should be implemented at the Cloudflare Worker level
- Sensitive data is not logged

## 📝 Usage from Cloudflare Worker

```typescript
// In your Cloudflare Worker
async function sendGiftViaVercel(recipientId: string, giftId: string) {
  const response = await fetch('https://your-vercel-app.vercel.app/api/send-gift', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientId,
      giftId,
      accountType: 'main',
      apiId: env.TELEGRAM_MAIN_API_ID,
      apiHash: env.TELEGRAM_MAIN_API_HASH,
      sessionString: env.TELEGRAM_MAIN_SESSION_STRING,
      userId: env.MAIN_ACCOUNT_USER_ID
    })
  });
  
  return await response.json();
}
```


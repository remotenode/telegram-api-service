# Telegram API Service

A modular Telegram API service built with TypeScript and the telegram (gramjs) library for real MTProto integration.

## 🏗️ Architecture

```
src/
├── client/baseClient.ts       # Base client with connection management
├── operations/
│   ├── user/                  # User operations
│   ├── channel/               # Channel operations
│   ├── message/               # Message operations
│   ├── media/                 # Media operations
│   ├── chat/                  # Chat/dialog operations
│   └── payment/               # Payment operations
├── utils/typeGuards.ts        # Type checking utilities
└── telegramService.ts         # Main service aggregating all operations
```

## 🚀 Features

- **Real Telegram MTProto Integration**: Uses telegram/gramjs for direct API access
- **Modular Architecture**: Operations organized by category for maintainability
- **Full API Coverage**: Implements real Telegram API methods, no mocks
- **TypeScript Support**: Full type safety with TypeScript

## 📡 API Documentation

### Interactive Documentation
- **API Index**: `/api` - Landing page with links to all documentation
- **Swagger UI**: `/api/docs` - Interactive API documentation with try-it-out functionality
- **ReDoc**: `/api/redoc` - Clean, responsive API reference documentation
- **OpenAPI Spec**: `/api/openapi` - Raw OpenAPI 3.0 specification in JSON format
- **Postman Collection**: [postman-collection.json](./postman-collection.json) - Import into Postman
- **Code Examples**: [API_EXAMPLES.md](./API_EXAMPLES.md) - Examples in multiple languages

### API Endpoints

#### POST `/api/validate-session`
Validate a Telegram session and get user information.

**Request Body:**
```json
{
  "accountType": "main",
  "apiId": 12345,
  "apiHash": "your-api-hash",
  "sessionString": "your-session-string",
  "userId": "123456789"
}
```

### POST `/api/get-similar-channels`
Get channels similar to a specified channel.

**Request Body:**
```json
{
  "channelId": "@channelname",
  "limit": 10,
  "accountType": "main",
  "apiId": 12345,
  "apiHash": "your-api-hash",
  "sessionString": "your-session-string",
  "userId": "123456789"
}
```

## 📚 Available Operations

### User Operations
- `validateSession()` - Validate session and get user info
- `getUsers(ids)` - Get users by IDs or usernames
- `getUserPhotos(userId, limit)` - Get user profile photos
- `updateProfile(updates)` - Update profile information
- `getBlockedUsers(limit)` - Get list of blocked users

### Channel Operations
- `getSimilarChannels(channelId, limit)` - Get recommended similar channels
- `getChannelInfo(channelId)` - Get full channel information
- `getChannelParticipants(channelId, limit, filter)` - Get channel members
- `searchChannels(query, limit)` - Search for channels/groups
- `joinChannel(channelId)` - Join a channel
- `leaveChannel(channelId)` - Leave a channel

### Message Operations
- `sendMessage(chatId, message, options)` - Send text message
- `getMessages(chatId, limit, options)` - Get messages from chat
- `deleteMessages(chatId, messageIds, revoke)` - Delete messages
- `editMessage(chatId, messageId, newText, options)` - Edit message
- `forwardMessages(fromChatId, toChatId, messageIds, options)` - Forward messages
- `pinMessage(chatId, messageId, options)` - Pin/unpin message
- `markAsRead(chatId, messageIds)` - Mark messages as read
- `sendTyping(chatId, action)` - Send typing indicator

### Media Operations
- `sendPhoto(chatId, photo, options)` - Send photo
- `sendDocument(chatId, document, options)` - Send document/file
- `sendVideo(chatId, video, options)` - Send video
- `sendVoice(chatId, voice, options)` - Send voice message
- `downloadMedia(message, options)` - Download media
- `sendAlbum(chatId, files, options)` - Send media album
- `setChatPhoto(chatId, photo)` - Set chat/channel photo

### Chat Operations
- `getDialogs(limit, options)` - Get all chats/dialogs
- `createGroup(title, users, about)` - Create new group
- `deleteChat(chatId, options)` - Delete/leave chat
- `archiveChat(chatId, archive)` - Archive/unarchive chat
- `muteChat(chatId, muteUntil)` - Mute/unmute notifications
- `clearHistory(chatId, options)` - Clear chat history
- `getCommonChats(userId, limit)` - Get common chats with user
- `reportChat(chatId, reason, comment)` - Report chat/channel

### Payment Operations
- `getPaymentForm(invoice)` - Get payment form
- `sendPaymentForm(...)` - Send payment
- `getPaymentReceipt(msgId, peer)` - Get payment receipt
- `getPremiumGiftCodeOptions(boostPeer)` - Get premium gift options
- `checkGiftCode(slug)` - Check gift code validity
- `applyGiftCode(slug)` - Apply gift code

## 🛠️ Development

### Prerequisites
- Node.js 18+
- TypeScript
- Vercel CLI (for deployment)

### Installation
```bash
npm install
```

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm run deploy
```

## 💻 Usage Example

```typescript
import { TelegramService } from './src/telegramService';

const telegram = new TelegramService({
  apiId: 12345,
  apiHash: 'your-api-hash',
  sessionString: 'your-session-string',
  userId: 'user-id'
});

// Validate session
const session = await telegram.validateSession();

// Get similar channels
const similar = await telegram.channel.getSimilarChannels('@channelname', 10);

// Send message
const sent = await telegram.message.sendMessage('@username', 'Hello!');

// Download media from a message
const media = await telegram.media.downloadMedia(message);

// Get all dialogs
const dialogs = await telegram.chat.getDialogs(50);

// Disconnect when done
await telegram.disconnect();
```

## 🔒 Security

- Session strings are validated before use
- All operations use real Telegram API with proper error handling
- Sensitive data is not logged
- Connection management handled automatically

## 📝 Notes

- All operations use real Telegram MTProto API calls
- Type conversions handle BigInt and complex Telegram types
- Error handling returns consistent `{ success, error }` format
- Connection is managed automatically but can be explicitly disconnected
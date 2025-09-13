# Telegram API Operations

This document lists all the real Telegram API operations that have been implemented in the modular structure.

## Structure

The codebase is organized into operation categories:

```
src/
├── client/
│   └── baseClient.ts          # Base client with connection management
├── operations/
│   ├── user/                  # User-related operations
│   ├── channel/               # Channel operations
│   ├── message/               # Message operations
│   ├── media/                 # Media operations
│   ├── chat/                  # Chat/dialog operations
│   └── payment/               # Payment operations
├── utils/
│   └── typeGuards.ts          # Type checking utilities
└── telegramService.ts         # Main service aggregating all operations
```

## Available Operations

### User Operations (`telegramService.user.*`)
- `validateSession()` - Validate session and get user info with full details
- `getUsers(ids)` - Get users by IDs or usernames
- `getUserPhotos(userId, limit)` - Get user profile photos
- `updateProfile(updates)` - Update profile (name, about)
- `getBlockedUsers(limit)` - Get list of blocked users

### Channel Operations (`telegramService.channel.*`)
- `getSimilarChannels(channelId, limit)` - Get recommended similar channels
- `getChannelInfo(channelId)` - Get full channel information
- `getChannelParticipants(channelId, limit, filter)` - Get channel members
- `searchChannels(query, limit)` - Search for channels/groups
- `joinChannel(channelId)` - Join a channel
- `leaveChannel(channelId)` - Leave a channel

### Message Operations (`telegramService.message.*`)
- `sendMessage(chatId, message, options)` - Send text message
- `getMessages(chatId, limit, options)` - Get messages from chat
- `deleteMessages(chatId, messageIds, revoke)` - Delete messages
- `editMessage(chatId, messageId, newText, options)` - Edit message
- `forwardMessages(fromChatId, toChatId, messageIds, options)` - Forward messages
- `pinMessage(chatId, messageId, options)` - Pin/unpin message
- `getPinnedMessages(chatId)` - Get pinned messages
- `markAsRead(chatId, messageIds)` - Mark messages as read
- `sendTyping(chatId, action)` - Send typing indicator

### Media Operations (`telegramService.media.*`)
- `sendPhoto(chatId, photo, options)` - Send photo
- `sendDocument(chatId, document, options)` - Send document/file
- `downloadMedia(message, options)` - Download media from message
- `getFileInfo(fileLocation)` - Get file information
- `sendAlbum(chatId, files, options)` - Send media album
- `setChatPhoto(chatId, photo)` - Set chat/channel photo
- `deleteChatPhoto(chatId)` - Delete chat/channel photo
- `sendVoice(chatId, voice, options)` - Send voice message
- `sendVideo(chatId, video, options)` - Send video

### Chat Operations (`telegramService.chat.*`)
- `getDialogs(limit, options)` - Get all chats/dialogs
- `createGroup(title, users, about)` - Create new group
- `deleteChat(chatId, options)` - Delete/leave chat
- `archiveChat(chatId, archive)` - Archive/unarchive chat
- `muteChat(chatId, muteUntil)` - Mute/unmute notifications
- `clearHistory(chatId, options)` - Clear chat history
- `getCommonChats(userId, limit)` - Get common chats with user
- `reportChat(chatId, reason, comment)` - Report chat/channel

### Payment Operations (`telegramService.payment.*`)
- `getPaymentForm(invoice)` - Get payment form
- `sendPaymentForm(...)` - Send payment
- `getPaymentReceipt(msgId, peer)` - Get payment receipt
- `getSavedInfo()` - Get saved payment info
- `clearSavedInfo(info, credentials)` - Clear saved payment info
- `getBankCardData(number)` - Get bank card data
- `validateRequestedInfo(invoice, info, save)` - Validate payment info
- `exportInvoice(invoiceMedia)` - Export invoice URL
- `getPremiumGiftCodeOptions(boostPeer)` - Get premium gift options
- `checkGiftCode(slug)` - Check gift code validity
- `applyGiftCode(slug)` - Apply gift code
- `getGiveawayInfo(peer, msgId)` - Get giveaway information
- `launchPrepaidGiveaway(...)` - Launch prepaid giveaway


## Usage Example

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

// Download media
const media = await telegram.media.downloadMedia(message);

// Disconnect when done
await telegram.disconnect();
```

## Notes

1. All operations use real Telegram MTProto API calls
2. Type conversions handle BigInt and complex Telegram types
3. Error handling returns consistent `{ success, error }` format
4. Connection is managed automatically but can be explicitly disconnected
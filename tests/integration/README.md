# Integration Tests

This directory contains comprehensive integration tests for all Telegram API endpoints. Each endpoint has its own individual test file for granular testing and debugging.

## Test Structure

### Individual Test Files

Each endpoint has its own test file organized by category:

#### Channel Tests
- `channel/get-channel-info.test.ts` - Test getting channel information
- `channel/get-channel-participants.test.ts` - Test getting channel participants
- `channel/get-similar-channels.test.ts` - Test finding similar channels
- `channel/join-channel.test.ts` - Test joining channels
- `channel/leave-channel.test.ts` - Test leaving channels
- `channel/search-channels.test.ts` - Test searching for channels

#### Chat Tests
- `chat/archive-chat.test.ts` - Test archiving chats
- `chat/clear-history.test.ts` - Test clearing chat history
- `chat/create-group.test.ts` - Test creating groups
- `chat/delete-chat.test.ts` - Test deleting chats
- `chat/get-chat-admins.test.ts` - Test getting chat administrators
- `chat/get-dialogs.test.ts` - Test getting user dialogs
- `chat/mute-chat.test.ts` - Test muting chats
- `chat/report-chat.test.ts` - Test reporting chats

#### Media Tests
- `media/download-media.test.ts` - Test downloading media files
- `media/get-chat-photo.test.ts` - Test getting chat photos
- `media/send-album.test.ts` - Test sending photo albums
- `media/send-document.test.ts` - Test sending documents
- `media/send-photo.test.ts` - Test sending photos
- `media/send-sticker.test.ts` - Test sending stickers
- `media/send-video.test.ts` - Test sending videos
- `media/send-voice.test.ts` - Test sending voice messages
- `media/set-chat-photo.test.ts` - Test setting chat photos

#### Message Tests
- `message/delete-messages.test.ts` - Test deleting messages
- `message/edit-message.test.ts` - Test editing messages
- `message/forward-messages.test.ts` - Test forwarding messages
- `message/get-message-history.test.ts` - Test getting message history
- `message/get-message-reactions.test.ts` - Test getting message reactions
- `message/get-messages.test.ts` - Test getting specific messages
- `message/mark-as-read.test.ts` - Test marking messages as read
- `message/pin-message.test.ts` - Test pinning messages
- `message/send-message.test.ts` - Test sending messages
- `message/send-typing.test.ts` - Test sending typing indicators
- `message/set-message-reaction.test.ts` - Test setting message reactions

#### Payment Tests
- `payment/check-gift-code.test.ts` - Test checking gift codes
- `payment/get-giveaway-info.test.ts` - Test getting giveaway information
- `payment/get-payment-form.test.ts` - Test getting payment forms
- `payment/get-payment-receipt.test.ts` - Test getting payment receipts
- `payment/send-payment-form.test.ts` - Test sending payment forms

#### User Tests
- `user/block-user.test.ts` - Test blocking users
- `user/get-blocked-users.test.ts` - Test getting blocked users list
- `user/get-common-chats.test.ts` - Test getting common chats with users
- `user/get-user-photos.test.ts` - Test getting user photos
- `user/get-user-status.test.ts` - Test getting user status
- `user/get-users.test.ts` - Test getting user information
- `user/search-users.test.ts` - Test searching for users
- `user/unblock-user.test.ts` - Test unblocking users
- `user/update-profile.test.ts` - Test updating user profile
- `user/validate-session.test.ts` - Test validating user session

## Running Tests

### Individual Tests

Run any individual test using the specific npm script:

```bash
# Channel tests
npm run test:channel:get-channel-info
npm run test:channel:get-channel-participants
npm run test:channel:get-similar-channels
npm run test:channel:join-channel
npm run test:channel:leave-channel
npm run test:channel:search-channels

# Chat tests
npm run test:chat:archive-chat
npm run test:chat:clear-history
npm run test:chat:create-group
npm run test:chat:delete-chat
npm run test:chat:get-chat-admins
npm run test:chat:get-dialogs
npm run test:chat:mute-chat
npm run test:chat:report-chat

# Media tests
npm run test:media:download-media
npm run test:media:get-chat-photo
npm run test:media:send-album
npm run test:media:send-document
npm run test:media:send-photo
npm run test:media:send-sticker
npm run test:media:send-video
npm run test:media:send-voice
npm run test:media:set-chat-photo

# Message tests
npm run test:message:delete-messages
npm run test:message:edit-message
npm run test:message:forward-messages
npm run test:message:get-message-history
npm run test:message:get-message-reactions
npm run test:message:get-messages
npm run test:message:mark-as-read
npm run test:message:pin-message
npm run test:message:send-message
npm run test:message:send-typing
npm run test:message:set-message-reaction

# Payment tests
npm run test:payment:check-gift-code
npm run test:payment:get-giveaway-info
npm run test:payment:get-payment-form
npm run test:payment:get-payment-receipt
npm run test:payment:send-payment-form

# User tests
npm run test:user:block-user
npm run test:user:get-blocked-users
npm run test:user:get-common-chats
npm run test:user:get-user-photos
npm run test:user:get-user-status
npm run test:user:get-users
npm run test:user:search-users
npm run test:user:unblock-user
npm run test:user:update-profile
npm run test:user:validate-session
```

### Category Tests

Run all tests for a specific category:

```bash
npm run test:user        # All user operations
npm run test:message     # All message operations
npm run test:chat        # All chat operations
npm run test:channel     # All channel operations
npm run test:media       # All media operations
npm run test:payment     # All payment operations
```

### All Individual Tests

Run all individual endpoint tests at once:

```bash
npm run test:all-individual
```

### All Tests (Original)

Run the original comprehensive test suite:

```bash
npm run test:integration
```

## Test Configuration

### Credentials

Tests use credentials from `credentials.ts`. Make sure to configure your Telegram API credentials:

```typescript
export const credentials: TestCredentials = {
  account1: {
    apiId: YOUR_API_ID,
    apiHash: 'YOUR_API_HASH',
    sessionString: 'YOUR_SESSION_STRING',
    userId: 'YOUR_USER_ID'
  },
  account2: {
    // Same or different account for testing
  }
};
```

### Test Framework

All tests use the `IntegrationTestFramework` which provides:
- Automatic setup and cleanup
- Error handling and reporting
- Performance timing
- Consistent test structure

## Test Results

Each test provides:
- ✅ **PASSED** - Test completed successfully
- ❌ **FAILED** - Test failed with error details
- ⏱️ **Duration** - Time taken to complete the test
- 📊 **Summary** - Overall test statistics

## Troubleshooting

### Common Issues

1. **Connection Errors**: Ensure your Telegram API credentials are valid
2. **Rate Limiting**: Some tests may fail due to Telegram rate limits
3. **Permission Errors**: Some operations require specific permissions
4. **Network Issues**: Check your internet connection

### Debug Mode

For detailed debugging, check the console output which includes:
- Connection logs
- API call details
- Error stack traces
- Performance metrics

## Contributing

When adding new endpoints:

1. Create a new test file in the appropriate category directory
2. Follow the existing test pattern and structure
3. Add the test script to `package.json`
4. Update this README with the new test command
5. Test the new endpoint thoroughly

## Test Coverage

Current test coverage includes:
- **47 individual endpoint tests**
- **6 category test suites**
- **1 comprehensive test runner**
- **All major Telegram API operations**

This ensures comprehensive testing of all API functionality with granular control for debugging and development.
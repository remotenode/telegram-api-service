# Integration Tests

Comprehensive integration tests for all Telegram API operations between two accounts.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Provide credentials** (choose one method):

   **Method 1: Environment Variables**
   ```bash
   export API_ID=your_api_id
   export API_HASH=your_api_hash
   export ACCOUNT1_SESSION=your_session_string_1
   export ACCOUNT1_USER_ID=your_user_id_1
   export ACCOUNT2_SESSION=your_session_string_2
   export ACCOUNT2_USER_ID=your_user_id_2
   ```

   **Method 2: Credentials File**
   ```bash
   cp credentials.example.ts credentials.ts
   # Edit credentials.ts with your actual credentials
   ```

## Running Tests

### Run All Tests
```bash
npm run test:integration
```

### Run Individual Test Suites
```bash
npm run test:user      # User operations
npm run test:message   # Message operations  
npm run test:chat      # Chat operations
npm run test:channel   # Channel operations
npm run test:media     # Media operations
npm run test:payment   # Payment operations
```

## Test Structure

Each test file is focused on a specific operation category:

- **`user.test.ts`** - User validation, profile updates, user lookup
- **`message.test.ts`** - Send, edit, get messages
- **`chat.test.ts`** - Create groups, manage dialogs, archive chats
- **`channel.test.ts`** - Search channels, get channel info, similar channels
- **`media.test.ts`** - Send photos/documents, download media
- **`payment.test.ts`** - Payment forms, gift codes (requires real data)

## Test Framework

The `test-framework.ts` provides:
- Automatic setup/cleanup of Telegram connections
- Consistent test result reporting
- Test data generation utilities
- Performance timing
- Error handling and logging

## Expected Results

- **User/Message/Chat/Channel/Media tests**: Should pass with valid credentials
- **Payment tests**: Will likely fail without real payment data (expected)

## Notes

- Tests use real Telegram API calls
- Some tests create temporary groups/chats that are cleaned up
- Payment operations require actual invoices/payment forms to work
- Tests are designed to be non-destructive but may create test data

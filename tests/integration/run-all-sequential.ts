#!/usr/bin/env ts-node

import { credentials } from './credentials';

// Import all individual test functions
import { testGetChannelInfo } from './channel/get-channel-info.test';
import { testGetChannelParticipants } from './channel/get-channel-participants.test';
import { testGetSimilarChannels } from './channel/get-similar-channels.test';
import { testJoinChannel } from './channel/join-channel.test';
import { testLeaveChannel } from './channel/leave-channel.test';
import { testSearchChannels } from './channel/search-channels.test';

import { testArchiveChat } from './chat/archive-chat.test';
import { testClearHistory } from './chat/clear-history.test';
import { testCreateGroup } from './chat/create-group.test';
import { testDeleteChat } from './chat/delete-chat.test';
import { testGetChatAdmins } from './chat/get-chat-admins.test';
import { testGetDialogs } from './chat/get-dialogs.test';
import { testMuteChat } from './chat/mute-chat.test';
import { testReportChat } from './chat/report-chat.test';

import { testDownloadMedia } from './media/download-media.test';
import { testGetChatPhoto } from './media/get-chat-photo.test';
import { testSendAlbum } from './media/send-album.test';
import { testSendDocument } from './media/send-document.test';
import { testSendPhoto } from './media/send-photo.test';
import { testSendSticker } from './media/send-sticker.test';
import { testSendVideo } from './media/send-video.test';
import { testSendVoice } from './media/send-voice.test';
import { testSetChatPhoto } from './media/set-chat-photo.test';

import { testDeleteMessages } from './message/delete-messages.test';
import { testEditMessage } from './message/edit-message.test';
import { testForwardMessages } from './message/forward-messages.test';
import { testGetMessageHistory } from './message/get-message-history.test';
import { testGetMessageReactions } from './message/get-message-reactions.test';
import { testGetMessages } from './message/get-messages.test';
import { testMarkAsRead } from './message/mark-as-read.test';
import { testPinMessage } from './message/pin-message.test';
import { testSendMessage } from './message/send-message.test';
import { testSendTyping } from './message/send-typing.test';
import { testSetMessageReaction } from './message/set-message-reaction.test';

import { testCheckGiftCode } from './payment/check-gift-code.test';
import { testGetGiveawayInfo } from './payment/get-giveaway-info.test';
import { testGetPaymentForm } from './payment/get-payment-form.test';
import { testGetPaymentReceipt } from './payment/get-payment-receipt.test';
import { testSendPaymentForm } from './payment/send-payment-form.test';

import { testBlockUser } from './user/block-user.test';
import { testGetBlockedUsers } from './user/get-blocked-users.test';
import { testGetCommonChats } from './user/get-common-chats.test';
import { testGetUserPhotos } from './user/get-user-photos.test';
import { testGetUserStatus } from './user/get-user-status.test';
import { testGetUsers } from './user/get-users.test';
import { testSearchUsers } from './user/search-users.test';
import { testUnblockUser } from './user/unblock-user.test';
import { testUpdateProfile } from './user/update-profile.test';
import { testValidateSession } from './user/validate-session.test';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

async function runTestSequentially(name: string, testFn: () => Promise<any>): Promise<TestResult> {
  const startTime = Date.now();
  try {
    console.log(`\n🧪 Running: ${name}`);
    await testFn();
    const duration = Date.now() - startTime;
    console.log(`✅ ${name} - PASSED (${duration}ms)`);
    return { name, success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ ${name} - FAILED (${duration}ms): ${errorMessage}`);
    return { name, success: false, error: errorMessage, duration };
  }
}

async function runAllTestsSequentially() {
  console.log('🚀 Starting ALL individual endpoint tests sequentially...\n');
  
  const tests = [
    // Channel tests
    { name: 'Get Channel Info', fn: () => testGetChannelInfo(credentials) },
    { name: 'Get Channel Participants', fn: () => testGetChannelParticipants(credentials) },
    { name: 'Get Similar Channels', fn: () => testGetSimilarChannels(credentials) },
    { name: 'Join Channel', fn: () => testJoinChannel(credentials) },
    { name: 'Leave Channel', fn: () => testLeaveChannel(credentials) },
    { name: 'Search Channels', fn: () => testSearchChannels(credentials) },
    
    // Chat tests
    { name: 'Archive Chat', fn: () => testArchiveChat(credentials) },
    { name: 'Clear History', fn: () => testClearHistory(credentials) },
    { name: 'Create Group', fn: () => testCreateGroup(credentials) },
    { name: 'Delete Chat', fn: () => testDeleteChat(credentials) },
    { name: 'Get Chat Admins', fn: () => testGetChatAdmins(credentials) },
    { name: 'Get Dialogs', fn: () => testGetDialogs(credentials) },
    { name: 'Mute Chat', fn: () => testMuteChat(credentials) },
    { name: 'Report Chat', fn: () => testReportChat(credentials) },
    
    // Media tests
    { name: 'Download Media', fn: () => testDownloadMedia(credentials) },
    { name: 'Get Chat Photo', fn: () => testGetChatPhoto(credentials) },
    { name: 'Send Album', fn: () => testSendAlbum(credentials) },
    { name: 'Send Document', fn: () => testSendDocument(credentials) },
    { name: 'Send Photo', fn: () => testSendPhoto(credentials) },
    { name: 'Send Sticker', fn: () => testSendSticker(credentials) },
    { name: 'Send Video', fn: () => testSendVideo(credentials) },
    { name: 'Send Voice', fn: () => testSendVoice(credentials) },
    { name: 'Set Chat Photo', fn: () => testSetChatPhoto(credentials) },
    
    // Message tests
    { name: 'Delete Messages', fn: () => testDeleteMessages(credentials) },
    { name: 'Edit Message', fn: () => testEditMessage(credentials) },
    { name: 'Forward Messages', fn: () => testForwardMessages(credentials) },
    { name: 'Get Message History', fn: () => testGetMessageHistory(credentials) },
    { name: 'Get Message Reactions', fn: () => testGetMessageReactions(credentials) },
    { name: 'Get Messages', fn: () => testGetMessages(credentials) },
    { name: 'Mark As Read', fn: () => testMarkAsRead(credentials) },
    { name: 'Pin Message', fn: () => testPinMessage(credentials) },
    { name: 'Send Message', fn: () => testSendMessage(credentials) },
    { name: 'Send Typing', fn: () => testSendTyping(credentials) },
    { name: 'Set Message Reaction', fn: () => testSetMessageReaction(credentials) },
    
    // Payment tests
    { name: 'Check Gift Code', fn: () => testCheckGiftCode(credentials) },
    { name: 'Get Giveaway Info', fn: () => testGetGiveawayInfo(credentials) },
    { name: 'Get Payment Form', fn: () => testGetPaymentForm(credentials) },
    { name: 'Get Payment Receipt', fn: () => testGetPaymentReceipt(credentials) },
    { name: 'Send Payment Form', fn: () => testSendPaymentForm(credentials) },
    
    // User tests
    { name: 'Block User', fn: () => testBlockUser(credentials) },
    { name: 'Get Blocked Users', fn: () => testGetBlockedUsers(credentials) },
    { name: 'Get Common Chats', fn: () => testGetCommonChats(credentials) },
    { name: 'Get User Photos', fn: () => testGetUserPhotos(credentials) },
    { name: 'Get User Status', fn: () => testGetUserStatus(credentials) },
    { name: 'Get Users', fn: () => testGetUsers(credentials) },
    { name: 'Search Users', fn: () => testSearchUsers(credentials) },
    { name: 'Unblock User', fn: () => testUnblockUser(credentials) },
    { name: 'Update Profile', fn: () => testUpdateProfile(credentials) },
    { name: 'Validate Session', fn: () => testValidateSession(credentials) },
  ];
  
  const results: TestResult[] = [];
  
  // CRITICAL: Run tests one by one, never in parallel
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n[${i + 1}/${tests.length}] Starting: ${test.name}`);
    
    // Run test and wait for completion
    const result = await runTestSequentially(test.name, test.fn);
    results.push(result);
    
    // Wait between tests to ensure clean separation
    if (i < tests.length - 1) {
      console.log(`⏳ Waiting 2 seconds before next test...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total Duration: ${totalDuration}ms`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 All individual endpoint tests completed sequentially!');
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllTestsSequentially().catch(console.error);
}

export { runAllTestsSequentially };

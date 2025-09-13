const fetch = require('node-fetch');

async function testSimilarChannels() {
  const baseUrl = 'https://telegram-api-service-jzsdi2bbh.vercel.app';
  
  console.log('🧪 Testing get-similar-channels endpoint...\n');

  try {
    const response = await fetch(`${baseUrl}/api/get-similar-channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelId: '@test_channel',
        limit: 5,
        accountType: 'pull',
        apiId: 25072862,
        apiHash: 'e494cd2e650002434b55deff94c24d0a',
        sessionString: 'test_session_string',
        userId: '6979747160'
      })
    });

    const result = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Body:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success && result.channels) {
      console.log('\n✅ Test passed! Found similar channels:');
      result.channels.forEach((channel, index) => {
        console.log(`  ${index + 1}. ${channel.title} (@${channel.username || 'no_username'})`);
        console.log(`     Type: ${channel.type}, Members: ${channel.participants_count || 'N/A'}`);
        console.log(`     Verified: ${channel.is_verified ? '✅' : '❌'}`);
      });
    } else {
      console.log('\n❌ Test failed:', result.error || 'Unknown error');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testSimilarChannels();

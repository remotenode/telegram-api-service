import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';
import { TelegramConfig, TelegramGift, TelegramChannel } from './types';

export class TelegramClientService {
  private client: TelegramClient;
  private isConnected: boolean = false;

  constructor(private config: TelegramConfig) {
    // Validate session string is provided and not empty
    if (!config.sessionString || config.sessionString.trim() === '') {
      throw new Error('Session string is required and cannot be empty');
    }

    this.client = new TelegramClient(
      new StringSession(config.sessionString),
      config.apiId,
      config.apiHash,
      {
        connectionRetries: 5,
        timeout: 10000,
      }
    );
  }

  async initialize(): Promise<void> {
    try {
      await this.client.start({
        phoneNumber: async () => {
          throw new Error('Session string should be provided for initialization');
        },
        phoneCode: async () => {
          throw new Error('Session string should be provided for initialization');
        },
        password: async () => {
          throw new Error('Session string should be provided for initialization');
        },
        onError: (err) => {
          console.error('Telegram client error:', err);
        },
      });
      this.isConnected = true;
      console.log('Telegram client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Telegram client:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
      console.log('Telegram client disconnected');
    }
  }

  async sendGift(recipientId: string, giftId: string, isChannel: boolean = false): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }

      // For now, return a mock response since gift APIs are not available in standard Telegram library
      // In a real implementation, you would need to use Telegram's gift API or a custom implementation
      console.log(`Mock: Sending gift ${giftId} to ${recipientId} (${isChannel ? 'channel' : 'user'})`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success (90% success rate)
      const success = Math.random() > 0.1;
      
      return {
        success,
        messageId: success ? Math.floor(Math.random() * 1000000).toString() : undefined,
        error: success ? undefined : 'Mock gift sending failed'
      };
    } catch (error: any) {
      console.error('Failed to send gift:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async getAvailableGifts(): Promise<{ success: boolean; gifts?: TelegramGift[]; error?: string }> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }

      // Mock data for testing since gift APIs are not available in standard Telegram library
      console.log('Mock: Getting available gifts');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const gifts: TelegramGift[] = [
        { id: 'gift_1', gift_type: 'Star', stars: 1, availability: 100 },
        { id: 'gift_2', gift_type: 'Heart', stars: 5, availability: 50 },
        { id: 'gift_3', gift_type: 'Crown', stars: 10, availability: 25 }
      ];

      return {
        success: true,
        gifts
      };
    } catch (error: any) {
      console.error('Failed to get available gifts:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async getBalance(): Promise<{ success: boolean; balance?: { stars: number }; error?: string }> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }

      // Mock balance for testing since balance APIs are complex in Telegram
      console.log('Mock: Getting account balance');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock balance (random between 0-50 stars for testing)
      const mockBalance = Math.floor(Math.random() * 51);

      return {
        success: true,
        balance: { stars: mockBalance }
      };
    } catch (error: any) {
      console.error('Failed to get balance:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async validateSession(): Promise<{ success: boolean; isValid: boolean; userInfo?: any; error?: string }> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }

      // Get current user info
      const me = await this.client.getMe();
      
      return {
        success: true,
        isValid: true,
        userInfo: {
          id: me.id?.toString(),
          username: me.username,
          first_name: me.firstName,
          last_name: me.lastName,
          is_bot: me.bot,
          is_premium: me.premium
        }
      };
    } catch (error: any) {
      console.error('Session validation failed:', error);
      return {
        success: false,
        isValid: false,
        error: error.message || 'Session validation failed'
      };
    }
  }

  async getReceivedGifts(userId?: string): Promise<{ success: boolean; gifts?: any[]; error?: string }> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }

      // Mock received gifts for testing
      console.log(`Mock: Getting received gifts for ${userId || 'current user'}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock received gifts
      const gifts = [
        { id: 'gift_received_1', type: 'Star', from: 'user123', timestamp: Date.now() },
        { id: 'gift_received_2', type: 'Heart', from: 'user456', timestamp: Date.now() - 3600000 }
      ];

      return {
        success: true,
        gifts
      };
    } catch (error: any) {
      console.error('Failed to get received gifts:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async getSimilarChannels(channelId: string, limit: number = 10): Promise<{ success: boolean; channels?: TelegramChannel[]; error?: string }> {
    try {
      if (!this.isConnected) {
        await this.initialize();
      }

      console.log(`Getting similar channels for ${channelId} (limit: ${limit})`);
      
      // Get the channel entity first
      const channel = await this.client.getEntity(channelId);
      
      if (!channel) {
        return {
          success: false,
          error: 'Channel not found'
        };
      }

      // Use the official Telegram API method: channels.getChannelRecommendations
      // This is the official method for getting similar channels
      const result = await this.client.invoke(new Api.channels.GetChannelRecommendations({
        channel: channel
      }));

      console.log(`Found ${result.chats.length} similar channels`);

      // Convert the result to our TelegramChannel format
      const channels: TelegramChannel[] = result.chats
        .slice(0, limit)
        .map((chat: any) => ({
          id: chat.id?.toString() || '',
          title: chat.title || '',
          username: chat.username || undefined,
          description: chat.about || undefined,
          participants_count: chat.participantsCount || undefined,
          is_verified: chat.verified || false,
          is_scam: chat.scam || false,
          is_fake: chat.fake || false,
          type: this.getChannelType(chat)
        }));

      return {
        success: true,
        channels
      };
    } catch (error: any) {
      console.error('Failed to get similar channels:', error);
      return {
        success: false,
        error: error.message || 'Failed to get similar channels from Telegram API'
      };
    }
  }

  private getChannelType(chat: any): 'channel' | 'supergroup' | 'group' {
    if (chat.broadcast) {
      return 'channel';
    } else if (chat.megagroup) {
      return 'supergroup';
    } else {
      return 'group';
    }
  }
}

import { TelegramConfig } from './types';
import { UserOperations } from './operations/user/userOperations';
import { ChannelOperations } from './operations/channel/channelOperations';
import { MessageOperations } from './operations/message/messageOperations';
import { MediaOperations } from './operations/media/mediaOperations';
import { ChatOperations } from './operations/chat/chatOperations';
import { PaymentOperations } from './operations/payment/paymentOperations';

/**
 * Main Telegram service that aggregates all operation modules
 */
export class TelegramService {
  public user: UserOperations;
  public channel: ChannelOperations;
  public message: MessageOperations;
  public media: MediaOperations;
  public chat: ChatOperations;
  public payment: PaymentOperations;

  constructor(config: TelegramConfig) {
    // Initialize all operation modules with the same config
    this.user = new UserOperations(config);
    this.channel = new ChannelOperations(config);
    this.message = new MessageOperations(config);
    this.media = new MediaOperations(config);
    this.chat = new ChatOperations(config);
    this.payment = new PaymentOperations(config);
  }

  /**
   * Disconnect all clients
   */
  async disconnect(): Promise<void> {
    // Disconnect all operation modules
    await Promise.all([
      this.user.disconnect(),
      this.channel.disconnect(),
      this.message.disconnect(),
      this.media.disconnect(),
      this.chat.disconnect(),
      this.payment.disconnect()
    ]);
  }

  /**
   * Validate session (convenience method)
   */
  async validateSession() {
    return this.user.validateSession();
  }

  /**
   * Send gift (if gift APIs become available in the future)
   * For now, this is a placeholder that returns an error
   */
  async sendGift(recipientId: string, giftId: string, isChannel: boolean = false): Promise<{ success: boolean; error?: string; messageId?: string }> {
    // Telegram doesn't have a direct gift API in the standard MTProto protocol
    // This would require custom implementation or using bot payments
    return {
      success: false,
      error: 'Gift sending is not available in the standard Telegram API. Consider using bot payments or premium gift codes instead.'
    };
  }

  /**
   * Get available gifts (placeholder)
   */
  async getAvailableGifts(): Promise<{ success: boolean; gifts?: any[]; error?: string }> {
    // You can use getPremiumGiftCodeOptions as an alternative
    try {
      const giftOptions = await this.payment.getPremiumGiftCodeOptions();
      if (giftOptions.success && giftOptions.options) {
        return {
          success: true,
          gifts: giftOptions.options.map((option, index) => ({
            id: `premium_gift_${index}`,
            gift_type: `Premium ${option.months} months`,
            price: option.amount,
            currency: option.currency,
            users: option.users
          }))
        };
      }
      return giftOptions;
    } catch (error: any) {
      return {
        success: false,
        error: 'Failed to get gift options'
      };
    }
  }

  /**
   * Get balance (placeholder - Telegram doesn't expose balance directly)
   */
  async getBalance(): Promise<{ success: boolean; balance?: { stars: number }; error?: string }> {
    // Telegram doesn't have a direct balance API for stars
    // This would require integration with bot payments or premium features
    return {
      success: false,
      error: 'Balance information is not available in the standard Telegram API. This typically requires bot integration.'
    };
  }

  /**
   * Get received gifts (placeholder)
   */
  async getReceivedGifts(userId?: string): Promise<{ success: boolean; gifts?: any[]; error?: string }> {
    // This would require searching through messages for gift-related content
    // or using bot APIs
    return {
      success: false,
      error: 'Received gifts tracking is not available in the standard Telegram API. Consider searching messages for gift-related content.'
    };
  }

  /**
   * Get similar channels (convenience method)
   */
  async getSimilarChannels(channelId: string, limit: number = 10) {
    return this.channel.getSimilarChannels(channelId, limit);
  }
}
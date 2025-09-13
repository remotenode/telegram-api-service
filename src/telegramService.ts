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
   * Get similar channels (convenience method)
   */
  async getSimilarChannels(channelId: string, limit: number = 10) {
    return this.channel.getSimilarChannels(channelId, limit);
  }
}
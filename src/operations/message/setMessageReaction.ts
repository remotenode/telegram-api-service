import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class SetMessageReactionOperation {
  constructor(private client: TelegramClient) {}

  async setMessageReaction(chatId: string | number, messageId: number, reaction?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      
      await this.client.invoke(new Api.messages.SendReaction({
        peer: entity,
        msgId: messageId,
        reaction: reaction ? [new Api.ReactionEmoji({ emoticon: reaction })] : []
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to set message reaction:', error);
      return {
        success: false,
        error: error.message || 'Failed to set message reaction'
      };
    }
  }
}

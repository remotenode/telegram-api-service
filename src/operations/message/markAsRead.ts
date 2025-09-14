import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class MarkAsReadOperation {
  constructor(private client: TelegramClient) {}

  async markAsRead(chatId: string | number, messageIds?: number[]): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      
      if (messageIds && messageIds.length > 0) {
        // Mark specific messages as read
        await this.client.invoke(new Api.messages.ReadMessageContents({
          id: messageIds
        }));
      } else {
        // Mark all messages in chat as read
        await this.client.invoke(new Api.messages.ReadHistory({
          peer: entity,
          maxId: 0
        }));
      }

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark messages as read'
      };
    }
  }
}

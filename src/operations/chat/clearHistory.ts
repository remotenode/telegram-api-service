import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class ClearHistoryOperation {
  constructor(private client: TelegramClient) {}

  async clearHistory(chatId: string | number, options?: { revoke?: boolean }): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      
      await this.client.invoke(new Api.messages.DeleteHistory({
        peer: entity,
        maxId: 0,
        revoke: options?.revoke || false
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to clear chat history:', error);
      return {
        success: false,
        error: error.message || 'Failed to clear chat history'
      };
    }
  }
}

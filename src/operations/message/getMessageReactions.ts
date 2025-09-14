import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class GetMessageReactionsOperation {
  constructor(private client: TelegramClient) {}

  async getMessageReactions(chatId: string | number, messageId: number): Promise<{ success: boolean; reactions?: any; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      const reactions = await this.client.invoke(new Api.messages.GetMessageReactionsList({
        peer: entity,
        id: messageId,
        limit: 100
      }));

      return {
        success: true,
        reactions: {
          count: reactions.count,
          reactions: reactions.reactions?.map((r: any) => ({
            reaction: r.reaction,
            count: r.count,
            chosen: r.chosen,
            users: r.users
          }))
        }
      };
    } catch (error: any) {
      console.error('Failed to get message reactions:', error);
      return {
        success: false,
        error: error.message || 'Failed to get message reactions'
      };
    }
  }
}

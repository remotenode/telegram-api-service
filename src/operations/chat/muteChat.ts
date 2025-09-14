import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class MuteChatOperation {
  constructor(private client: TelegramClient) {}

  async muteChat(chatId: string | number, muteUntil?: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      
      await this.client.invoke(new Api.account.UpdateNotifySettings({
        peer: new Api.InputNotifyPeer({ peer: entity as any }),
        settings: new Api.InputPeerNotifySettings({
          showPreviews: muteUntil ? false : undefined,
          silent: muteUntil ? true : false,
          muteUntil: muteUntil || 0
        })
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to mute/unmute chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to mute/unmute chat'
      };
    }
  }
}

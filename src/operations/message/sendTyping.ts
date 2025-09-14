import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class SendTypingOperation {
  constructor(private client: TelegramClient) {}

  async sendTyping(chatId: string | number, action: string = 'typing'): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      
      let actionType;
      switch (action) {
        case 'recording':
          actionType = new Api.SendMessageRecordVideoAction();
          break;
        case 'uploading':
          actionType = new Api.SendMessageUploadVideoAction({ progress: 0 });
          break;
        default:
          actionType = new Api.SendMessageTypingAction();
      }

      await this.client.invoke(new Api.messages.SetTyping({
        peer: entity,
        action: actionType
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to send typing indicator:', error);
      return {
        success: false,
        error: error.message || 'Failed to send typing indicator'
      };
    }
  }
}

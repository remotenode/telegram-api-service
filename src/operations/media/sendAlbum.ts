import { TelegramClient } from 'telegram';

export class SendAlbumOperation {
  constructor(private client: TelegramClient) {}

  async sendAlbum(chatId: string | number, files: (Buffer | string)[], options?: {
    captions?: string[];
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      const sentMessages = await this.client.sendFile(entity, {
        file: files,
        caption: options?.captions,
        replyTo: options?.replyTo,
        silent: options?.silent
      });

      return {
        success: true,
        messages: Array.isArray(sentMessages) ? sentMessages.map(msg => ({
          id: msg.id,
          text: msg.message,
          date: msg.date,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString(),
          media: msg.media
        })) : [{
          id: sentMessages.id,
          text: sentMessages.message,
          date: sentMessages.date,
          fromId: sentMessages.fromId?.toString(),
          peerId: sentMessages.peerId?.toString(),
          media: sentMessages.media
        }]
      };
    } catch (error: any) {
      console.error('Failed to send album:', error);
      return {
        success: false,
        error: error.message || 'Failed to send album'
      };
    }
  }
}

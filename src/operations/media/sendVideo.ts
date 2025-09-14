import { TelegramClient } from 'telegram';

export class SendVideoOperation {
  constructor(private client: TelegramClient) {}

  async sendVideo(chatId: string | number, video: Buffer | string, options?: {
    caption?: string;
    duration?: number;
    width?: number;
    height?: number;
    thumb?: Buffer | string;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: video,
        caption: options?.caption,
        thumb: options?.thumb,
        replyTo: options?.replyTo,
        silent: options?.silent
      });

      return {
        success: true,
        message: {
          id: sentMessage.id,
          text: sentMessage.message,
          date: sentMessage.date,
          fromId: sentMessage.fromId?.toString(),
          peerId: sentMessage.peerId?.toString(),
          media: sentMessage.media
        }
      };
    } catch (error: any) {
      console.error('Failed to send video:', error);
      return {
        success: false,
        error: error.message || 'Failed to send video'
      };
    }
  }
}

import { TelegramClient } from 'telegram';

export class SendStickerOperation {
  constructor(private client: TelegramClient) {}

  async sendSticker(chatId: string | number, sticker: Buffer | string, options?: {
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: sticker,
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
      console.error('Failed to send sticker:', error);
      return {
        success: false,
        error: error.message || 'Failed to send sticker'
      };
    }
  }
}

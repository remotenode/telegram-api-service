import { TelegramClient } from 'telegram';

export class SendVoiceOperation {
  constructor(private client: TelegramClient) {}

  async sendVoice(chatId: string | number, voice: Buffer | string, options?: {
    duration?: number;
    waveform?: Buffer;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: voice,
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
      console.error('Failed to send voice:', error);
      return {
        success: false,
        error: error.message || 'Failed to send voice'
      };
    }
  }
}

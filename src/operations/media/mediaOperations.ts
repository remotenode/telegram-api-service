import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import { SendVideoOperation } from './sendVideo';
import { SendVoiceOperation } from './sendVoice';
import { SendAlbumOperation } from './sendAlbum';
import { SendStickerOperation } from './sendSticker';

export class MediaOperations extends BaseTelegramClient {
  private sendVideoOp: SendVideoOperation;
  private sendVoiceOp: SendVoiceOperation;
  private sendAlbumOp: SendAlbumOperation;
  private sendStickerOp: SendStickerOperation;

  constructor(config: any) {
    super(config);
    this.sendVideoOp = new SendVideoOperation(this.client);
    this.sendVoiceOp = new SendVoiceOperation(this.client);
    this.sendAlbumOp = new SendAlbumOperation(this.client);
    this.sendStickerOp = new SendStickerOperation(this.client);
  }

  /**
   * Send a photo to a chat
   */
  async sendPhoto(chatId: string | number, photo: Buffer | string, options?: {
    caption?: string;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: photo,
        caption: options?.caption,
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
      console.error('Failed to send photo:', error);
      return {
        success: false,
        error: error.message || 'Failed to send photo'
      };
    }
  }

  /**
   * Send a document to a chat
   */
  async sendDocument(chatId: string | number, document: Buffer | string, options?: {
    caption?: string;
    fileName?: string;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: document,
        caption: options?.caption,
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
      console.error('Failed to send document:', error);
      return {
        success: false,
        error: error.message || 'Failed to send document'
      };
    }
  }

  /**
   * Download media from a message
   */
  async downloadMedia(chatId: string | number, messageId: number, options?: {
    filePath?: string;
  }): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const messages = await this.client.getMessages(entity, { ids: messageId });
      
      if (messages.length === 0) {
        return {
          success: false,
          error: 'Message not found'
        };
      }

      const message = messages[0];
      if (!message.media) {
        return {
          success: false,
          error: 'Message has no media'
        };
      }

      const filePath = await this.client.downloadMedia(message, options?.filePath as any);

      return {
        success: true,
        filePath: filePath as string
      };
    } catch (error: any) {
      console.error('Failed to download media:', error);
      return {
        success: false,
        error: error.message || 'Failed to download media'
      };
    }
  }

  /**
   * Get chat photo
   */
  async getChatPhoto(chatId: string | number): Promise<{ success: boolean; photo?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const fullChat = await this.client.invoke(new Api.messages.GetFullChat({
        chatId: entity.id
      }));

      return {
        success: true,
        photo: fullChat.fullChat.chatPhoto
      };
    } catch (error: any) {
      console.error('Failed to get chat photo:', error);
      return {
        success: false,
        error: error.message || 'Failed to get chat photo'
      };
    }
  }

  /**
   * Set chat photo
   */
  async setChatPhoto(chatId: string | number, photo: Buffer | string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      await this.client.invoke(new Api.photos.UploadProfilePhoto({
        file: await this.client.uploadFile({ file: photo as any, workers: 1 }),
        bot: entity.className === 'User' && (entity as any).bot ? entity : undefined
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to set chat photo:', error);
      return {
        success: false,
        error: error.message || 'Failed to set chat photo'
      };
    }
  }

  /**
   * Send video file
   */
  async sendVideo(chatId: string | number, video: Buffer | string, options?: {
    caption?: string;
    duration?: number;
    width?: number;
    height?: number;
    thumb?: Buffer | string;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    return this.sendVideoOp.sendVideo(chatId, video, options);
  }

  /**
   * Send voice message
   */
  async sendVoice(chatId: string | number, voice: Buffer | string, options?: {
    duration?: number;
    waveform?: Buffer;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    return this.sendVoiceOp.sendVoice(chatId, voice, options);
  }

  /**
   * Send media album
   */
  async sendAlbum(chatId: string | number, files: (Buffer | string)[], options?: {
    captions?: string[];
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    return this.sendAlbumOp.sendAlbum(chatId, files, options);
  }

  /**
   * Send sticker
   */
  async sendSticker(chatId: string | number, sticker: Buffer | string, options?: {
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    return this.sendStickerOp.sendSticker(chatId, sticker, options);
  }
}
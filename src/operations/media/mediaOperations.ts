import { Api } from 'telegram/tl';
import bigInt from 'big-integer';
import { getFileInfo } from 'telegram/Utils';
import { CustomFile } from 'telegram/client/uploads';
import { BaseTelegramClient } from '../../client/baseClient';
import { Buffer } from 'buffer';

export class MediaOperations extends BaseTelegramClient {
  /**
   * Upload and send a photo
   */
  async sendPhoto(chatId: string | number, photo: Buffer | string, options?: {
    caption?: string;
    parseMode?: 'md' | 'html';
    replyTo?: number;
    silent?: boolean;
    scheduleDate?: number;
    compress?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const message = await this.client.sendFile(entity, {
        file: photo,
        caption: options?.caption,
        parseMode: options?.parseMode,
        replyTo: options?.replyTo,
        silent: options?.silent,
        scheduleDate: options?.scheduleDate,
        forceDocument: !options?.compress
      });

      return {
        success: true,
        message: {
          id: message.id,
          date: message.date,
          media: message.media,
          caption: message.message
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
   * Upload and send a document/file
   */
  async sendDocument(chatId: string | number, document: Buffer | string, options?: {
    filename?: string;
    caption?: string;
    parseMode?: 'md' | 'html';
    replyTo?: number;
    silent?: boolean;
    scheduleDate?: number;
    thumb?: Buffer | string;
    progressCallback?: (progress: number) => void;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const message = await this.client.sendFile(entity, {
        file: document,
        caption: options?.caption,
        parseMode: options?.parseMode,
        replyTo: options?.replyTo,
        silent: options?.silent,
        scheduleDate: options?.scheduleDate,
        thumb: options?.thumb,
        forceDocument: true,
        attributes: options?.filename ? [
          new Api.DocumentAttributeFilename({ fileName: options.filename })
        ] : undefined,
        progressCallback: options?.progressCallback
      });

      return {
        success: true,
        message: {
          id: message.id,
          date: message.date,
          media: message.media,
          caption: message.message
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
  async downloadMedia(messageOrMedia: any, options?: {
    outputPath?: string;
    progressCallback?: (progress: number) => void;
  }): Promise<{ success: boolean; buffer?: Buffer; path?: string; error?: string }> {
    try {
      await this.ensureConnected();

      const buffer = await this.client.downloadMedia(messageOrMedia, {
        progressCallback: options?.progressCallback ? (downloaded: bigInt.BigInteger, total: bigInt.BigInteger) => {
          // Convert BigInteger to number for the user's callback
          const progress = total.isZero() ? 0 : downloaded.toJSNumber() / total.toJSNumber();
          options.progressCallback!(progress);
        } : undefined
      });

      if (!buffer) {
        return {
          success: false,
          error: 'No media found in message'
        };
      }

      // If outputPath is provided, we'd need to save it to file system
      // For now, just return the buffer
      return {
        success: true,
        buffer: Buffer.from(buffer),
        path: options?.outputPath
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
   * Get file information
   */
  async getFileInfo(fileLocation: any): Promise<{ success: boolean; fileInfo?: any; error?: string }> {
    try {
      await this.ensureConnected();

      // Get file information
      const fileInfo = getFileInfo(fileLocation);

      return {
        success: true,
        fileInfo: fileInfo
      };
    } catch (error: any) {
      console.error('Failed to get file info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get file info'
      };
    }
  }

  /**
   * Send media group (album)
   */
  async sendAlbum(chatId: string | number, files: Array<Buffer | string>, options?: {
    captions?: string[];
    parseMode?: 'md' | 'html';
    replyTo?: number;
    silent?: boolean;
    scheduleDate?: number;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const messages = await this.client.sendFile(entity, {
        file: files,
        caption: options?.captions,
        parseMode: options?.parseMode,
        replyTo: options?.replyTo,
        silent: options?.silent,
        scheduleDate: options?.scheduleDate
      });

      return {
        success: true,
        messages: Array.isArray(messages) ? messages.map(msg => ({
          id: msg.id,
          date: msg.date,
          media: msg.media,
          caption: msg.message
        })) : [{
          id: messages.id,
          date: messages.date,
          media: messages.media,
          caption: messages.message
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

  /**
   * Set chat/channel photo
   */
  async setChatPhoto(chatId: string | number, photo: Buffer | string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      
      // Upload the photo first
      const customFile = new CustomFile('photo.jpg', Buffer.isBuffer(photo) ? photo.length : photo.length, '', Buffer.isBuffer(photo) ? photo : Buffer.from(photo));
      const file = await this.client.uploadFile({
        file: customFile,
        workers: 1
      });

      // Check if it's a channel/supergroup or regular chat
      if ('broadcast' in entity || 'megagroup' in entity) {
        await this.client.invoke(new Api.channels.EditPhoto({
          channel: entity,
          photo: new Api.InputChatUploadedPhoto({
            file: file
          })
        }));
      } else {
        await this.client.invoke(new Api.messages.EditChatPhoto({
          chatId: entity.id,
          photo: new Api.InputChatUploadedPhoto({
            file: file
          })
        }));
      }

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
   * Delete chat/channel photo
   */
  async deleteChatPhoto(chatId: string | number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      
      // Check if it's a channel/supergroup or regular chat
      if ('broadcast' in entity || 'megagroup' in entity) {
        await this.client.invoke(new Api.channels.EditPhoto({
          channel: entity,
          photo: new Api.InputChatPhotoEmpty()
        }));
      } else {
        await this.client.invoke(new Api.messages.EditChatPhoto({
          chatId: entity.id,
          photo: new Api.InputChatPhotoEmpty()
        }));
      }

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to delete chat photo:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete chat photo'
      };
    }
  }

  /**
   * Send voice message
   */
  async sendVoice(chatId: string | number, voice: Buffer | string, options?: {
    duration?: number;
    waveform?: number[];
    caption?: string;
    parseMode?: 'md' | 'html';
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const message = await this.client.sendFile(entity, {
        file: voice,
        caption: options?.caption,
        parseMode: options?.parseMode,
        replyTo: options?.replyTo,
        silent: options?.silent,
        attributes: [
          new Api.DocumentAttributeAudio({
            voice: true,
            duration: options?.duration || 0,
            waveform: Buffer.from(options?.waveform || [])
          })
        ]
      });

      return {
        success: true,
        message: {
          id: message.id,
          date: message.date,
          media: message.media,
          caption: message.message
        }
      };
    } catch (error: any) {
      console.error('Failed to send voice message:', error);
      return {
        success: false,
        error: error.message || 'Failed to send voice message'
      };
    }
  }

  /**
   * Send video
   */
  async sendVideo(chatId: string | number, video: Buffer | string, options?: {
    duration?: number;
    width?: number;
    height?: number;
    thumb?: Buffer | string;
    caption?: string;
    parseMode?: 'md' | 'html';
    replyTo?: number;
    silent?: boolean;
    supportsStreaming?: boolean;
    progressCallback?: (progress: number) => void;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const message = await this.client.sendFile(entity, {
        file: video,
        caption: options?.caption,
        parseMode: options?.parseMode,
        replyTo: options?.replyTo,
        silent: options?.silent,
        thumb: options?.thumb,
        progressCallback: options?.progressCallback,
        attributes: [
          new Api.DocumentAttributeVideo({
            duration: options?.duration || 0,
            w: options?.width || 0,
            h: options?.height || 0,
            supportsStreaming: options?.supportsStreaming || false
          })
        ]
      });

      return {
        success: true,
        message: {
          id: message.id,
          date: message.date,
          media: message.media,
          caption: message.message
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
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: video,
        caption: options?.caption,
        duration: options?.duration,
        width: options?.width,
        height: options?.height,
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

  /**
   * Send voice message
   */
  async sendVoice(chatId: string | number, voice: Buffer | string, options?: {
    duration?: number;
    waveform?: Buffer;
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: voice,
        duration: options?.duration,
        waveform: options?.waveform,
        replyTo: options?.replyTo,
        silent: options?.silent,
        voiceNote: true
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

  /**
   * Send media album
   */
  async sendAlbum(chatId: string | number, files: (Buffer | string)[], options?: {
    captions?: string[];
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

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

  /**
   * Send sticker
   */
  async sendSticker(chatId: string | number, sticker: Buffer | string, options?: {
    replyTo?: number;
    silent?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendFile(entity, {
        file: sticker,
        replyTo: options?.replyTo,
        silent: options?.silent,
        sticker: true
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
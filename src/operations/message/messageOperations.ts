import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import { NewMessage } from 'telegram/events';
import { MarkAsReadOperation } from './markAsRead';
import { SendTypingOperation } from './sendTyping';
import { GetMessageReactionsOperation } from './getMessageReactions';
import { SetMessageReactionOperation } from './setMessageReaction';

export class MessageOperations extends BaseTelegramClient {
  private markAsReadOp: MarkAsReadOperation;
  private sendTypingOp: SendTypingOperation;
  private getMessageReactionsOp: GetMessageReactionsOperation;
  private setMessageReactionOp: SetMessageReactionOperation;

  constructor(config: any) {
    super(config);
    this.markAsReadOp = new MarkAsReadOperation(this.client);
    this.sendTypingOp = new SendTypingOperation(this.client);
    this.getMessageReactionsOp = new GetMessageReactionsOperation(this.client);
    this.setMessageReactionOp = new SetMessageReactionOperation(this.client);
  }

  /**
   * Send a message to a user or channel
   */
  async sendMessage(chatId: string | number, message: string, options?: {
    replyTo?: number;
    parseMode?: 'md' | 'html';
    linkPreview?: boolean;
    silent?: boolean;
    scheduleDate?: number;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const sentMessage = await this.client.sendMessage(entity, {
        message: message,
        replyTo: options?.replyTo,
        parseMode: options?.parseMode,
        linkPreview: options?.linkPreview,
        silent: options?.silent,
        schedule: options?.scheduleDate
      });

      return {
        success: true,
        message: {
          id: sentMessage.id,
          text: sentMessage.message,
          date: sentMessage.date,
          fromId: sentMessage.fromId?.toString(),
          peerId: sentMessage.peerId?.toString()
        }
      };
    } catch (error: any) {
      console.error('Failed to send message:', error);
      return {
        success: false,
        error: error.message || 'Failed to send message'
      };
    }
  }

  /**
   * Get message history for a chat
   */
  async getMessageHistory(chatId: string | number, limit: number = 50, offsetId?: number): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const messages = await this.client.getMessages(entity, {
        limit: limit,
        offsetId: offsetId
      });

      return {
        success: true,
        messages: messages.map(msg => ({
          id: msg.id,
          text: msg.message,
          date: msg.date,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString(),
          media: msg.media,
          replyTo: msg.replyTo
        }))
      };
    } catch (error: any) {
      console.error('Failed to get message history:', error);
      return {
        success: false,
        error: error.message || 'Failed to get message history'
      };
    }
  }

  /**
   * Get specific messages by IDs
   */
  async getMessages(chatId: string | number, messageIds: number[]): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const messages = await this.client.getMessages(entity, {
        ids: messageIds
      });

      return {
        success: true,
        messages: messages.map(msg => ({
          id: msg.id,
          text: msg.message,
          date: msg.date,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString(),
          media: msg.media,
          replyTo: msg.replyTo
        }))
      };
    } catch (error: any) {
      console.error('Failed to get messages:', error);
      return {
        success: false,
        error: error.message || 'Failed to get messages'
      };
    }
  }

  /**
   * Edit a message
   */
  async editMessage(chatId: string | number, messageId: number, newText: string, options?: {
    parseMode?: 'md' | 'html';
    linkPreview?: boolean;
  }): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const editedMessage = await this.client.editMessage(entity, {
        message: messageId,
        text: newText,
        parseMode: options?.parseMode,
        linkPreview: options?.linkPreview
      });

      return {
        success: true,
        message: {
          id: editedMessage.id,
          text: editedMessage.message,
          date: editedMessage.date,
          fromId: editedMessage.fromId?.toString(),
          peerId: editedMessage.peerId?.toString(),
          editDate: editedMessage.editDate
        }
      };
    } catch (error: any) {
      console.error('Failed to edit message:', error);
      return {
        success: false,
        error: error.message || 'Failed to edit message'
      };
    }
  }

  /**
   * Delete messages
   */
  async deleteMessages(chatId: string | number, messageIds: number[], revoke?: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      await this.client.deleteMessages(entity, messageIds, { revoke });

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to delete messages:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete messages'
      };
    }
  }

  /**
   * Forward messages
   */
  async forwardMessages(fromChatId: string | number, toChatId: string | number, messageIds: number[], options?: {
    silent?: boolean;
    scheduleDate?: number;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const fromEntity = await this.client.getEntity(fromChatId);
      const toEntity = await this.client.getEntity(toChatId);
      
      const forwardedMessages = await this.client.forwardMessages(toEntity, {
        messages: messageIds,
        fromPeer: fromEntity,
        silent: options?.silent,
        schedule: options?.scheduleDate
      });

      return {
        success: true,
        messages: Array.isArray(forwardedMessages) ? forwardedMessages.map(msg => ({
          id: msg.id,
          text: msg.message,
          date: msg.date,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString()
        })) : [{
          id: (forwardedMessages as any).id,
          text: (forwardedMessages as any).message,
          date: (forwardedMessages as any).date,
          fromId: (forwardedMessages as any).fromId?.toString(),
          peerId: (forwardedMessages as any).peerId?.toString()
        }]
      };
    } catch (error: any) {
      console.error('Failed to forward messages:', error);
      return {
        success: false,
        error: error.message || 'Failed to forward messages'
      };
    }
  }

  /**
   * Pin a message
   */
  async pinMessage(chatId: string | number, messageId: number, notify?: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      await this.client.pinMessage(entity, messageId, { notify });

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to pin message:', error);
      return {
        success: false,
        error: error.message || 'Failed to pin message'
      };
    }
  }

  /**
   * Send typing indicator
   */
  async sendTyping(chatId: string | number, action: 'typing' | 'cancel' | 'recording' | 'upload_photo' | 'upload_video' | 'upload_audio' | 'upload_document' = 'typing'): Promise<{ success: boolean; error?: string }> {
    return this.sendTypingOp.sendTyping(chatId, action);
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string | number, messageIds?: number[]): Promise<{ success: boolean; error?: string }> {
    return this.markAsReadOp.markAsRead(chatId, messageIds);
  }

  /**
   * Get message reactions
   */
  async getMessageReactions(chatId: string | number, messageId: number): Promise<{ success: boolean; reactions?: any; error?: string }> {
    return this.getMessageReactionsOp.getMessageReactions(chatId, messageId);
  }

  /**
   * Set message reaction
   */
  async setMessageReaction(chatId: string | number, messageId: number, reaction?: string): Promise<{ success: boolean; error?: string }> {
    return this.setMessageReactionOp.setMessageReaction(chatId, messageId, reaction);
  }
}
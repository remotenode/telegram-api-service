import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import { NewMessage } from 'telegram/events';

export class MessageOperations extends BaseTelegramClient {
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
        message,
        replyTo: options?.replyTo,
        parseMode: options?.parseMode,
        linkPreview: options?.linkPreview !== false,
        silent: options?.silent,
        schedule: options?.scheduleDate
      });

      return {
        success: true,
        message: {
          id: sentMessage.id,
          message: sentMessage.message,
          date: sentMessage.date,
          out: sentMessage.out,
          mentioned: sentMessage.mentioned,
          mediaUnread: sentMessage.mediaUnread,
          silent: sentMessage.silent,
          post: sentMessage.post,
          fromScheduled: sentMessage.fromScheduled,
          legacy: sentMessage.legacy,
          editHide: sentMessage.editHide,
          pinned: sentMessage.pinned,
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
   * Get messages from a chat
   */
  async getMessages(chatId: string | number, limit: number = 100, options?: {
    offsetId?: number;
    offsetDate?: number;
    addOffset?: number;
    maxId?: number;
    minId?: number;
    search?: string;
    fromUser?: string | number;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const messages = await this.client.getMessages(entity, {
        limit,
        offsetId: options?.offsetId,
        offsetDate: options?.offsetDate,
        addOffset: options?.addOffset,
        maxId: options?.maxId,
        minId: options?.minId,
        search: options?.search,
        fromUser: options?.fromUser
      });

      return {
        success: true,
        messages: messages.map(msg => ({
          id: msg.id,
          message: msg.message,
          date: msg.date,
          out: msg.out,
          mentioned: msg.mentioned,
          mediaUnread: msg.mediaUnread,
          silent: msg.silent,
          post: msg.post,
          fromScheduled: msg.fromScheduled,
          legacy: msg.legacy,
          editHide: msg.editHide,
          pinned: msg.pinned,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString(),
          fwdFrom: msg.fwdFrom,
          viaBotId: msg.viaBotId?.toString(),
          replyTo: msg.replyTo,
          media: msg.media,
          replyMarkup: msg.replyMarkup,
          entities: msg.entities,
          views: msg.views,
          forwards: msg.forwards,
          replies: msg.replies,
          editDate: msg.editDate,
          postAuthor: msg.postAuthor,
          groupedId: msg.groupedId?.toString(),
          reactions: msg.reactions,
          restrictionReason: msg.restrictionReason,
          ttlPeriod: msg.ttlPeriod
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
   * Delete messages
   */
  async deleteMessages(chatId: string | number, messageIds: number[], revoke: boolean = true): Promise<{ success: boolean; error?: string }> {
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
        linkPreview: options?.linkPreview !== false
      });

      return {
        success: true,
        message: {
          id: editedMessage.id,
          message: editedMessage.message,
          date: editedMessage.date,
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
   * Forward messages
   */
  async forwardMessages(fromChatId: string | number, toChatId: string | number, messageIds: number[], options?: {
    silent?: boolean;
    background?: boolean;
    withMyScore?: boolean;
    dropAuthor?: boolean;
    dropMediaCaptions?: boolean;
  }): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const fromEntity = await this.client.getEntity(fromChatId);
      const toEntity = await this.client.getEntity(toChatId);

      const forwarded = await this.client.forwardMessages(toEntity, {
        messages: messageIds,
        fromPeer: fromEntity,
        silent: options?.silent,
        dropAuthor: options?.dropAuthor,
      });

      return {
        success: true,
        messages: forwarded.map(msg => ({
          id: msg.id,
          message: msg.message,
          date: msg.date,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString()
        }))
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
   * Pin a message in a chat
   */
  async pinMessage(chatId: string | number, messageId: number, options?: {
    silent?: boolean;
    unpin?: boolean;
    pmOneside?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      await this.client.pinMessage(entity, messageId, {
        notify: !options?.silent,
        pmOneSide: options?.pmOneside
      });

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
   * Get pinned messages
   */
  async getPinnedMessages(chatId: string | number): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const messages = await this.client.getMessages(entity, {
        filter: new Api.InputMessagesFilterPinned()
      });

      return {
        success: true,
        messages: messages.map(msg => ({
          id: msg.id,
          message: msg.message,
          date: msg.date,
          fromId: msg.fromId?.toString(),
          peerId: msg.peerId?.toString(),
          pinned: msg.pinned
        }))
      };
    } catch (error: any) {
      console.error('Failed to get pinned messages:', error);
      return {
        success: false,
        error: error.message || 'Failed to get pinned messages'
      };
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string | number, messageIds?: number[]): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      await this.client.markAsRead(entity, messageIds);

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
      return {
        success: false,
        error: error.message || 'Failed to mark messages as read'
      };
    }
  }

  /**
   * Send typing indicator
   */
  async sendTyping(chatId: string | number, action: 'typing' | 'cancel' | 'recording' | 'upload_photo' | 'upload_video' | 'upload_audio' | 'upload_document' = 'typing'): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      
      let typingAction: any;
      switch (action) {
        case 'cancel':
          typingAction = new Api.SendMessageCancelAction();
          break;
        case 'recording':
          typingAction = new Api.SendMessageRecordAudioAction();
          break;
        case 'upload_photo':
          typingAction = new Api.SendMessageUploadPhotoAction({ progress: 0 });
          break;
        case 'upload_video':
          typingAction = new Api.SendMessageUploadVideoAction({ progress: 0 });
          break;
        case 'upload_audio':
          typingAction = new Api.SendMessageUploadAudioAction({ progress: 0 });
          break;
        case 'upload_document':
          typingAction = new Api.SendMessageUploadDocumentAction({ progress: 0 });
          break;
        default:
          typingAction = new Api.SendMessageTypingAction();
      }

      await this.client.invoke(new Api.messages.SetTyping({
        peer: entity,
        action: typingAction
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
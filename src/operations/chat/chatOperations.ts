import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import bigInt = require('big-integer');
import { MuteChatOperation } from './muteChat';
import { ClearHistoryOperation } from './clearHistory';
import { ReportChatOperation } from './reportChat';
import { GetChatAdminsOperation } from './getChatAdmins';

export class ChatOperations extends BaseTelegramClient {
  private muteChatOp: MuteChatOperation;
  private clearHistoryOp: ClearHistoryOperation;
  private reportChatOp: ReportChatOperation;
  private getChatAdminsOp: GetChatAdminsOperation;

  constructor(config: any) {
    super(config);
    this.muteChatOp = new MuteChatOperation(this.client);
    this.clearHistoryOp = new ClearHistoryOperation(this.client);
    this.reportChatOp = new ReportChatOperation(this.client);
    this.getChatAdminsOp = new GetChatAdminsOperation(this.client);
  }

  /**
   * Get dialogs (chats list)
   */
  async getDialogs(limit: number = 100, offsetDate?: number, offsetId?: number, offsetPeer?: any): Promise<{ success: boolean; dialogs?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const dialogs = await this.client.getDialogs({
        limit: limit,
        offsetDate: offsetDate,
        offsetId: offsetId,
        offsetPeer: offsetPeer
      });

      return {
        success: true,
        dialogs: dialogs.map(dialog => ({
          id: dialog.id?.toString(),
          name: dialog.name,
          type: dialog.entity?.className,
          unreadCount: dialog.unreadCount,
          lastMessage: dialog.message ? {
            id: dialog.message.id,
            text: dialog.message.message,
            date: dialog.message.date,
            fromId: dialog.message.fromId?.toString()
          } : null,
          isPinned: dialog.pinned,
          isMuted: false // Dialog doesn't have isMuted property
        }))
      };
    } catch (error: any) {
      console.error('Failed to get dialogs:', error);
      return {
        success: false,
        error: error.message || 'Failed to get dialogs'
      };
    }
  }

  /**
   * Create a new group
   */
  async createGroup(title: string, users: string[]): Promise<{ success: boolean; group?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.messages.CreateChat({
        users: users,
        title: title
      }));

      // Extract chat information from the result
      let chat;
      const resultAny = result as any;
      if (resultAny.chats && resultAny.chats.length > 0) {
        chat = resultAny.chats[0];
      } else if (resultAny.updates && resultAny.updates.chats && resultAny.updates.chats.length > 0) {
        chat = resultAny.updates.chats[0];
      } else if (resultAny.updates && resultAny.updates.updates && resultAny.updates.updates.length > 0) {
        // Look for chat creation update
        const update = resultAny.updates.updates.find((u: any) => u.className === 'UpdateNewMessage');
        if (update && update.message && update.message.peerId) {
          chat = { id: update.message.peerId.chatId };
        }
      }

      if (!chat) {
        throw new Error('Failed to extract chat information from CreateChat result');
      }

      return {
        success: true,
        group: {
          id: chat.id?.toString(),
          title: chat.title,
          type: chat.className,
          participantsCount: chat.participantsCount,
          createdBy: chat.creatorId?.toString()
        }
      };
    } catch (error: any) {
      console.error('Failed to create group:', error);
      return {
        success: false,
        error: error.message || 'Failed to create group'
      };
    }
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string | number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      await this.client.invoke(new Api.messages.DeleteChat({
        chatId: entity.id
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to delete chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete chat'
      };
    }
  }

  /**
   * Archive a chat
   */
  async archiveChat(chatId: string | number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      // Convert string chatId to number if needed
      const numericChatId = typeof chatId === 'string' ? parseInt(chatId) : chatId;
      
      // Create the peer directly instead of using getEntity
      const peer = new Api.InputPeerChat({ chatId: bigInt(numericChatId) });

      await this.client.invoke(new Api.messages.ToggleDialogPin({
        peer: new Api.InputDialogPeer({ peer: peer }),
        pinned: false
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to archive chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to archive chat'
      };
    }
  }

  /**
   * Mute/unmute chat notifications
   */
  async muteChat(chatId: string | number, muteUntil?: number): Promise<{ success: boolean; error?: string }> {
    return this.muteChatOp.muteChat(chatId, muteUntil);
  }

  /**
   * Clear chat history
   */
  async clearHistory(chatId: string | number, options?: { revoke?: boolean }): Promise<{ success: boolean; error?: string }> {
    return this.clearHistoryOp.clearHistory(chatId, options);
  }

  /**
   * Report chat
   */
  async reportChat(chatId: string | number, reason: string, comment?: string): Promise<{ success: boolean; error?: string }> {
    return this.reportChatOp.reportChat(chatId, reason, comment);
  }

  /**
   * Get chat administrators
   */
  async getChatAdmins(chatId: string | number): Promise<{ success: boolean; admins?: any[]; error?: string }> {
    return this.getChatAdminsOp.getChatAdmins(chatId);
  }
}
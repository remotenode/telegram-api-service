import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import { Dialog } from 'telegram/tl/custom/dialog';
import bigInt from 'big-integer';

export class ChatOperations extends BaseTelegramClient {
  /**
   * Get all dialogs/chats
   */
  async getDialogs(limit: number = 100, options?: {
    offsetDate?: number;
    offsetId?: number;
    offsetPeer?: any;
    ignorePinned?: boolean;
    ignoreMigrated?: boolean;
    folder?: number;
    archived?: boolean;
  }): Promise<{ success: boolean; dialogs?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const dialogs = await this.client.getDialogs({
        limit,
        offsetDate: options?.offsetDate,
        offsetId: options?.offsetId,
        offsetPeer: options?.offsetPeer,
        ignorePinned: options?.ignorePinned,
        ignoreMigrated: options?.ignoreMigrated,
        folder: options?.folder,
        archived: options?.archived
      });

      return {
        success: true,
        dialogs: dialogs.map(dialog => ({
          id: dialog.id?.toString(),
          name: dialog.name,
          title: dialog.title,
          isUser: dialog.isUser,
          isGroup: dialog.isGroup,
          isChannel: dialog.isChannel,
          date: dialog.date,
          message: dialog.message ? {
            id: dialog.message.id,
            text: dialog.message.text,
            date: dialog.message.date,
            out: dialog.message.out,
            mentioned: dialog.message.mentioned,
            mediaUnread: dialog.message.mediaUnread,
            silent: dialog.message.silent,
            fromId: dialog.message.fromId?.toString()
          } : undefined,
          unreadCount: dialog.unreadCount,
          unreadMentionsCount: dialog.unreadMentionsCount,
          unreadReactionsCount: 0, // Not available in current API
          pinned: dialog.pinned,
          archived: dialog.archived,
          folderId: dialog.folderId,
          entity: dialog.entity ? {
            id: dialog.entity.id?.toString(),
            username: (dialog.entity as any).username || undefined,
            firstName: (dialog.entity as any).firstName || undefined,
            lastName: (dialog.entity as any).lastName || undefined,
            phone: (dialog.entity as any).phone || undefined,
            photo: (dialog.entity as any).photo || undefined,
            status: (dialog.entity as any).status || undefined,
            verified: (dialog.entity as any).verified || false,
            restricted: (dialog.entity as any).restricted || false,
            scam: (dialog.entity as any).scam || false,
            fake: (dialog.entity as any).fake || false,
            bot: (dialog.entity as any).bot || false,
            botChatHistory: (dialog.entity as any).botChatHistory || false,
            botNochats: (dialog.entity as any).botNochats || false,
            botInlineGeo: (dialog.entity as any).botInlineGeo || false,
            support: (dialog.entity as any).support || false,
            participantsCount: (dialog.entity as any).participantsCount || 0
          } : undefined
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
   * Create a new group chat
   */
  async createGroup(title: string, users: (string | number)[], about?: string): Promise<{ success: boolean; chat?: any; error?: string }> {
    try {
      await this.ensureConnected();

      // Get user entities
      const userEntities = await Promise.all(users.map(user => this.client.getEntity(user)));

      // Create the group
      const result = await this.client.invoke(new Api.messages.CreateChat({
        users: userEntities,
        title: title
      }));

      // Get the created chat info
      const chat = (result as any).chats[0];

      // Update group description if provided
      if (about && chat.id) {
        try {
          await this.client.invoke(new Api.messages.EditChatAbout({
            peer: chat.id,
            about: about
          }));
        } catch (err) {
          console.error('Failed to set group description:', err);
        }
      }

      return {
        success: true,
        chat: {
          id: chat.id?.toString(),
          title: chat.title,
          participantsCount: chat.participantsCount,
          date: chat.date,
          version: chat.version,
          migratedTo: chat.migratedTo,
          photo: chat.photo,
          adminRights: chat.adminRights,
          defaultBannedRights: chat.defaultBannedRights
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
   * Delete/leave a chat
   */
  async deleteChat(chatId: string | number, options?: {
    revoke?: boolean;
    deleteForAll?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);

      // For channels and supergroups
      if ('broadcast' in entity || 'megagroup' in entity) {
        await this.client.invoke(new Api.channels.LeaveChannel({
          channel: entity
        }));
      } 
      // For regular groups
      else if ('chatPhoto' in entity) {
        await this.client.invoke(new Api.messages.DeleteChatUser({
          chatId: entity.id,
          userId: new Api.InputUserSelf(),
          revokeHistory: options?.revoke || false
        }));
      }
      // For private chats
      else {
        await this.client.invoke(new Api.messages.DeleteHistory({
          peer: entity,
          maxId: 0,
          revoke: options?.deleteForAll || false
        }));
      }

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to delete/leave chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete/leave chat'
      };
    }
  }

  /**
   * Archive/unarchive a chat
   */
  async archiveChat(chatId: string | number, archive: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      const folderId = archive ? 1 : 0; // 1 for archive, 0 for main

      await this.client.invoke(new Api.folders.EditPeerFolders({
        folderPeers: [
          new Api.InputFolderPeer({
            peer: entity as any,
            folderId: folderId
          })
        ]
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to archive/unarchive chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to archive/unarchive chat'
      };
    }
  }

  /**
   * Mute/unmute notifications for a chat
   */
  async muteChat(chatId: string | number, muteUntil?: number | 'forever'): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      
      let muteUntilTimestamp: number;
      if (muteUntil === 'forever') {
        muteUntilTimestamp = 2147483647; // Max int32, effectively forever
      } else if (muteUntil) {
        muteUntilTimestamp = muteUntil;
      } else {
        muteUntilTimestamp = 0; // Unmute
      }

      await this.client.invoke(new Api.account.UpdateNotifySettings({
        peer: new Api.InputNotifyPeer({ peer: entity as any }),
        settings: new Api.InputPeerNotifySettings({
          showPreviews: true,
          silent: muteUntilTimestamp > 0,
          muteUntil: muteUntilTimestamp,
          sound: muteUntilTimestamp > 0 ? new Api.NotificationSoundNone() : new Api.NotificationSoundDefault()
        })
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to mute/unmute chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to mute/unmute chat'
      };
    }
  }

  /**
   * Clear chat history
   */
  async clearHistory(chatId: string | number, options?: {
    deleteForAll?: boolean;
    maxId?: number;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);

      await this.client.invoke(new Api.messages.DeleteHistory({
        peer: entity,
        maxId: options?.maxId || 0,
        revoke: options?.deleteForAll || false
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to clear chat history:', error);
      return {
        success: false,
        error: error.message || 'Failed to clear chat history'
      };
    }
  }

  /**
   * Get common chats with a user
   */
  async getCommonChats(userId: string | number, limit: number = 100): Promise<{ success: boolean; chats?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const user = await this.client.getEntity(userId);
      const result = await this.client.invoke(new Api.messages.GetCommonChats({
        userId: user,
        maxId: bigInt(0),
        limit: limit
      }));

      return {
        success: true,
        chats: result.chats.map((chat: any) => ({
          id: chat.id?.toString(),
          title: chat.title,
          username: chat.username,
          participantsCount: chat.participantsCount,
          date: chat.date,
          isChannel: chat.broadcast || false,
          isSupergroup: chat.megagroup || false,
          isGroup: !chat.broadcast && !chat.megagroup,
          verified: chat.verified || false,
          restricted: chat.restricted || false,
          scam: chat.scam || false,
          fake: chat.fake || false
        }))
      };
    } catch (error: any) {
      console.error('Failed to get common chats:', error);
      return {
        success: false,
        error: error.message || 'Failed to get common chats'
      };
    }
  }

  /**
   * Report a chat
   */
  async reportChat(chatId: string | number, reason: 'spam' | 'violence' | 'pornography' | 'child_abuse' | 'copyright' | 'illegal_drugs' | 'personal_details' | 'other', comment?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const entity = await this.client.getEntity(chatId);
      
      let reportReason: any;
      switch (reason) {
        case 'spam':
          reportReason = new Api.InputReportReasonSpam();
          break;
        case 'violence':
          reportReason = new Api.InputReportReasonViolence();
          break;
        case 'pornography':
          reportReason = new Api.InputReportReasonPornography();
          break;
        case 'child_abuse':
          reportReason = new Api.InputReportReasonChildAbuse();
          break;
        case 'copyright':
          reportReason = new Api.InputReportReasonCopyright();
          break;
        case 'illegal_drugs':
          reportReason = new Api.InputReportReasonIllegalDrugs();
          break;
        case 'personal_details':
          reportReason = new Api.InputReportReasonPersonalDetails();
          break;
        default:
          reportReason = new Api.InputReportReasonOther();
      }

      await this.client.invoke(new Api.account.ReportPeer({
        peer: entity,
        reason: reportReason,
        message: comment || ''
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to report chat:', error);
      return {
        success: false,
        error: error.message || 'Failed to report chat'
      };
    }
  }
}
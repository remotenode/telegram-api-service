import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import bigInt = require('big-integer');
import { GetUserStatusOperation } from './getUserStatus';
import { SearchUsersOperation } from './searchUsers';

export class UserOperations extends BaseTelegramClient {
  private getUserStatusOp: GetUserStatusOperation;
  private searchUsersOp: SearchUsersOperation;

  constructor(config: any) {
    super(config);
    this.getUserStatusOp = new GetUserStatusOperation(this.client);
    this.searchUsersOp = new SearchUsersOperation(this.client);
  }

  /**
   * Get user information
   */
  async getUsers(userIds: string[]): Promise<{ success: boolean; users?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const users = await this.client.getEntity(userIds);
      const userArray = Array.isArray(users) ? users : [users];

      return {
        success: true,
        users: userArray.map(user => {
          const userAny = user as any;
          return {
            id: userAny.id?.toString(),
            username: userAny.username,
            first_name: userAny.firstName,
            last_name: userAny.lastName,
            is_bot: userAny.bot,
            is_premium: userAny.premium,
            phone: userAny.phone,
            about: userAny.about,
            profile_photo: userAny.photo,
            common_chats_count: userAny.commonChatsCount,
            blocked: userAny.blocked
          };
        })
      };
    } catch (error: any) {
      console.error('Failed to get users:', error);
      return {
        success: false,
        error: error.message || 'Failed to get users'
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(options: {
    firstName?: string;
    lastName?: string;
    about?: string;
  }): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.account.UpdateProfile({
        firstName: options.firstName,
        lastName: options.lastName,
        about: options.about
      }));

      return {
        success: true,
        user: {
          id: result.id?.toString(),
          username: (result as any).username,
          first_name: (result as any).firstName,
          last_name: (result as any).lastName,
          is_bot: (result as any).bot,
          is_premium: (result as any).premium,
          phone: (result as any).phone,
          about: (result as any).about,
          profile_photo: (result as any).photo
        }
      };
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  /**
   * Get user photos
   */
  async getUserPhotos(userId: string | number, limit: number = 20, offset: number = 0): Promise<{ success: boolean; photos?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const user = await this.client.getEntity(userId);
      const photos = await this.client.invoke(new Api.photos.GetUserPhotos({
        userId: user,
        offset: offset,
        maxId: bigInt(0),
        limit: limit
      }));

      return {
        success: true,
        photos: photos.photos?.map((photo: any) => ({
          id: photo.id?.toString(),
          date: photo.date,
          sizes: photo.sizes,
          dc_id: photo.dcId
        }))
      };
    } catch (error: any) {
      console.error('Failed to get user photos:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user photos'
      };
    }
  }

  /**
   * Get common chats with a user
   */
  async getCommonChats(userId: string | number, maxId: number = 0, limit: number = 100): Promise<{ success: boolean; chats?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const user = await this.client.getEntity(userId);
      const result = await this.client.invoke(new Api.messages.GetCommonChats({
        userId: user,
        maxId: bigInt(maxId),
        limit: limit
      }));

      return {
        success: true,
        chats: result.chats?.map((chat: any) => ({
          id: chat.id?.toString(),
          title: chat.title,
          type: chat.className,
          participants_count: chat.participantsCount,
          created_by: chat.creatorId?.toString()
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
   * Block a user
   */
  async blockUser(userId: string | number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const user = await this.client.getEntity(userId);
      await this.client.invoke(new Api.contacts.Block({
        id: user
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to block user:', error);
      return {
        success: false,
        error: error.message || 'Failed to block user'
      };
    }
  }

  /**
   * Unblock a user
   */
  async unblockUser(userId: string | number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const user = await this.client.getEntity(userId);
      await this.client.invoke(new Api.contacts.Unblock({
        id: user
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to unblock user:', error);
      return {
        success: false,
        error: error.message || 'Failed to unblock user'
      };
    }
  }

  /**
   * Get blocked users
   */
  async getBlockedUsers(offset: number = 0, limit: number = 100): Promise<{ success: boolean; users?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.contacts.GetBlocked({
        offset: offset,
        limit: limit
      }));

      return {
        success: true,
        users: result.users?.map((user: any) => ({
          id: user.id?.toString(),
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          is_bot: user.bot,
          is_premium: user.premium,
          phone: user.phone,
          about: user.about,
          profile_photo: user.photo,
          blocked: user.blocked
        }))
      };
    } catch (error: any) {
      console.error('Failed to get blocked users:', error);
      return {
        success: false,
        error: error.message || 'Failed to get blocked users'
      };
    }
  }

  /**
   * Validate session
   */
  async validateSession(): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const me = await this.client.getMe();
      return {
        success: true,
        user: {
          id: me.id?.toString(),
          username: me.username,
          first_name: me.firstName,
          last_name: me.lastName,
          is_bot: me.bot,
          is_premium: me.premium,
          phone: me.phone,
          about: (me as any).about,
          profile_photo: me.photo
        }
      };
    } catch (error: any) {
      console.error('Failed to validate session:', error);
      return {
        success: false,
        error: error.message || 'Failed to validate session'
      };
    }
  }

  /**
   * Get user online status
   */
  async getUserStatus(userId: string | number): Promise<{ success: boolean; status?: any; error?: string }> {
    return this.getUserStatusOp.getUserStatus(userId);
  }

  /**
   * Search for users
   */
  async searchUsers(query: string, limit: number = 20): Promise<{ success: boolean; users?: any[]; error?: string }> {
    return this.searchUsersOp.searchUsers(query, limit);
  }
}
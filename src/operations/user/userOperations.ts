import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import { ValidateSessionResponse } from '../../types';

export class UserOperations extends BaseTelegramClient {
  /**
   * Validates the current session and retrieves user information
   */
  async validateSession(): Promise<ValidateSessionResponse> {
    try {
      await this.ensureConnected();

      // Get current user info
      const me = await this.client.getMe();
      
      // Get full user info for more details
      const fullUser = await this.client.invoke(new Api.users.GetFullUser({
        id: new Api.InputUserSelf()
      }));

      return {
        success: true,
        isValid: true,
        userInfo: {
          id: me.id?.toString(),
          username: me.username,
          first_name: me.firstName,
          last_name: me.lastName,
          is_bot: me.bot,
          is_premium: me.premium,
          phone: me.phone,
          about: fullUser.fullUser.about,
          profile_photo: fullUser.fullUser.profilePhoto ? {
            id: fullUser.fullUser.profilePhoto.id?.toString(),
            dc_id: fullUser.fullUser.profilePhoto.dcId
          } : undefined,
          common_chats_count: fullUser.fullUser.commonChatsCount,
          blocked: fullUser.fullUser.blocked,
          can_pin_message: fullUser.fullUser.canPinMessage,
          has_private_forwards: fullUser.fullUser.privateForwardName !== undefined,
          settings: fullUser.fullUser.settings ? {
            report_spam: fullUser.fullUser.settings.reportSpam,
            add_contact: fullUser.fullUser.settings.addContact,
            block_contact: fullUser.fullUser.settings.blockContact,
            share_contact: fullUser.fullUser.settings.shareContact,
            report_geo: fullUser.fullUser.settings.reportGeo
          } : undefined
        }
      };
    } catch (error: any) {
      console.error('Session validation failed:', error);
      return {
        success: false,
        isValid: false,
        error: error.message || 'Session validation failed'
      };
    }
  }

  /**
   * Get users by their IDs or usernames
   */
  async getUsers(ids: (string | number)[]): Promise<{ success: boolean; users?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const inputUsers = await Promise.all(ids.map(async (id) => {
        try {
          const entity = await this.client.getEntity(id);
          return entity;
        } catch (err) {
          console.error(`Failed to get entity for ${id}:`, err);
          return null;
        }
      }));

      const validUsers = inputUsers.filter(u => u !== null);

      return {
        success: true,
        users: validUsers.map(user => ({
          id: user.id?.toString(),
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          is_bot: user.bot,
          is_premium: user.premium,
          is_verified: user.verified,
          is_restricted: user.restricted,
          is_scam: user.scam,
          is_fake: user.fake
        }))
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
   * Get user profile photos
   */
  async getUserPhotos(userId: string | number, limit: number = 10): Promise<{ success: boolean; photos?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const user = await this.client.getEntity(userId);
      const photos = await this.client.invoke(new Api.photos.GetUserPhotos({
        userId: user,
        offset: 0,
        maxId: 0,
        limit: limit
      }));

      return {
        success: true,
        photos: photos.photos.map(photo => ({
          id: photo.id?.toString(),
          date: photo.date,
          sizes: photo.sizes?.map((size: any) => ({
            type: size.type,
            width: size.w,
            height: size.h,
            size: size.size
          }))
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
   * Update profile information
   */
  async updateProfile(updates: {
    firstName?: string;
    lastName?: string;
    about?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const promises = [];

      // Update name if provided
      if (updates.firstName !== undefined || updates.lastName !== undefined) {
        promises.push(
          this.client.invoke(new Api.account.UpdateProfile({
            firstName: updates.firstName,
            lastName: updates.lastName
          }))
        );
      }

      // Update about/bio if provided
      if (updates.about !== undefined) {
        promises.push(
          this.client.invoke(new Api.account.UpdateProfile({
            about: updates.about
          }))
        );
      }

      await Promise.all(promises);

      return {
        success: true
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
   * Get current user's blocked users
   */
  async getBlockedUsers(limit: number = 100): Promise<{ success: boolean; blockedUsers?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const blocked = await this.client.invoke(new Api.contacts.GetBlocked({
        offset: 0,
        limit: limit
      }));

      const users = 'users' in blocked ? blocked.users : [];
      const blockedList = 'blocked' in blocked ? blocked.blocked : [];

      return {
        success: true,
        blockedUsers: blockedList.map((blockedUser: any, index: number) => {
          const user = users[index];
          return {
            id: user?.id?.toString(),
            username: user?.username,
            first_name: user?.firstName,
            last_name: user?.lastName,
            date: blockedUser.date
          };
        })
      };
    } catch (error: any) {
      console.error('Failed to get blocked users:', error);
      return {
        success: false,
        error: error.message || 'Failed to get blocked users'
      };
    }
  }
}
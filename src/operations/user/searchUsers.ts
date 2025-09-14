import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class SearchUsersOperation {
  constructor(private client: TelegramClient) {}

  async searchUsers(query: string, limit: number = 20): Promise<{ success: boolean; users?: any[]; error?: string }> {
    try {
      await this.client.connect();

      const results = await this.client.invoke(new Api.contacts.Search({
        q: query,
        limit: limit
      }));

      return {
        success: true,
        users: results.users?.map((user: any) => ({
          id: user.id?.toString(),
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
          is_bot: user.bot,
          is_premium: user.premium,
          phone: user.phone,
          about: user.about,
          profile_photo: user.photo,
          common_chats_count: user.commonChatsCount,
          blocked: user.blocked
        }))
      };
    } catch (error: any) {
      console.error('Failed to search users:', error);
      return {
        success: false,
        error: error.message || 'Failed to search users'
      };
    }
  }
}

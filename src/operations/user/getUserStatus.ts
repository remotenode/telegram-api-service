import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class GetUserStatusOperation {
  constructor(private client: TelegramClient) {}

  async getUserStatus(userId: string | number): Promise<{ success: boolean; status?: any; error?: string }> {
    try {
      await this.client.connect();

      const user = await this.client.getEntity(userId);
      const fullUser = await this.client.invoke(new Api.users.GetFullUser({
        id: user
      }));

      return {
        success: true,
        status: {
          user_id: userId,
          status: (fullUser.fullUser as any).status?.className || 'UserStatusOffline',
          was_online: (fullUser.fullUser as any).status?.wasOnline || null,
          expires: (fullUser.fullUser as any).status?.expires || null,
          last_seen: (fullUser.fullUser as any).status?.lastSeen || null
        }
      };
    } catch (error: any) {
      console.error('Failed to get user status:', error);
      return {
        success: false,
        error: error.message || 'Failed to get user status'
      };
    }
  }
}

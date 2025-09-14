import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class GetChatAdminsOperation {
  constructor(private client: TelegramClient) {}

  async getChatAdmins(chatId: string | number): Promise<{ success: boolean; admins?: any[]; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      const participants = await this.client.invoke(new Api.channels.GetParticipants({
        channel: entity,
        filter: new Api.ChannelParticipantsAdmins(),
        offset: 0,
        limit: 100
      }));

      return {
        success: true,
        admins: (participants as any).participants?.map((p: any) => ({
          user_id: p.userId?.toString(),
          is_creator: p.className === 'ChannelParticipantCreator',
          is_admin: p.className === 'ChannelParticipantAdmin',
          admin_rights: p.adminRights,
          promoted_by: p.promotedBy?.toString(),
          date: p.date
        })) || []
      };
    } catch (error: any) {
      console.error('Failed to get chat admins:', error);
      return {
        success: false,
        error: error.message || 'Failed to get chat admins'
      };
    }
  }
}

import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';
import { TelegramChannel, GetSimilarChannelsResponse } from '../../types';

export class ChannelOperations extends BaseTelegramClient {
  /**
   * Get similar/recommended channels for a given channel
   */
  async getSimilarChannels(channelId: string, limit: number = 10): Promise<GetSimilarChannelsResponse> {
    try {
      await this.ensureConnected();

      console.log(`Getting similar channels for ${channelId} (limit: ${limit})`);
      
      // Get the channel entity first
      const channel = await this.client.getEntity(channelId);
      
      if (!channel) {
        return {
          success: false,
          error: 'Channel not found'
        };
      }

      // Use the official Telegram API method
      const result = await this.client.invoke(new Api.channels.GetChannelRecommendations({
        channel: channel
      }));

      console.log(`Found ${result.chats.length} similar channels`);

      // Convert the result to our TelegramChannel format
      const channels: TelegramChannel[] = result.chats
        .slice(0, limit)
        .map((chat: any) => ({
          id: chat.id?.toString() || '',
          title: chat.title || '',
          username: chat.username || undefined,
          description: chat.about || undefined,
          participants_count: chat.participantsCount || undefined,
          is_verified: chat.verified || false,
          is_scam: chat.scam || false,
          is_fake: chat.fake || false,
          photo: undefined, // Photo object is complex, skip for now
          type: this.getChannelType(chat)
        }));

      return {
        success: true,
        channels
      };
    } catch (error: any) {
      console.error('Failed to get similar channels:', error);
      return {
        success: false,
        error: error.message || 'Failed to get similar channels from Telegram API'
      };
    }
  }

  /**
   * Get full channel information
   */
  async getChannelInfo(channelId: string): Promise<{ success: boolean; channel?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const channel = await this.client.getEntity(channelId);
      
      if (!channel || !('broadcast' in channel || 'megagroup' in channel)) {
        return {
          success: false,
          error: 'Not a valid channel'
        };
      }

      // Get full channel info
      const fullChannel = await this.client.invoke(new Api.channels.GetFullChannel({
        channel: channel
      }));

      const chatInfo = fullChannel.chats[0] as any;
      const fullChatInfo = fullChannel.fullChat as any;

      return {
        success: true,
        channel: {
          id: chatInfo.id?.toString(),
          title: chatInfo.title || '',
          username: chatInfo.username || undefined,
          description: fullChatInfo.about || undefined,
          participants_count: fullChatInfo.participantsCount || undefined,
          online_count: fullChatInfo.onlineCount || undefined,
          is_verified: chatInfo.verified || false,
          is_scam: chatInfo.scam || false,
          is_fake: chatInfo.fake || false,
          is_restricted: chatInfo.restricted || false,
          type: this.getChannelType(chatInfo),
          can_view_participants: fullChatInfo.canViewParticipants || false,
          can_set_username: fullChatInfo.canSetUsername || false,
          can_set_stickers: fullChatInfo.canSetStickers || false,
          can_view_stats: fullChatInfo.canViewStats || false,
          is_prehistory_hidden: fullChatInfo.hiddenPrehistory || false,
          linked_chat_id: fullChatInfo.linkedChatId?.toString(),
          location: fullChatInfo.location,
          slowmode_seconds: fullChatInfo.slowmodeSeconds,
          slowmode_next_send_date: fullChatInfo.slowmodeNextSendDate,
          stats_dc: fullChatInfo.statsDc,
          pts: fullChatInfo.pts,
          call: fullChatInfo.call,
          ttl_period: fullChatInfo.ttlPeriod,
          pending_suggestions: fullChatInfo.pendingSuggestions,
          groupcall_default_join_as: fullChatInfo.groupcallDefaultJoinAs,
          theme_emoticon: fullChatInfo.themeEmoticon,
          requests_pending: fullChatInfo.requestsPending,
          recent_requesters: fullChatInfo.recentRequesters,
          default_send_as: fullChatInfo.defaultSendAs,
          available_reactions: fullChatInfo.availableReactions
        }
      };
    } catch (error: any) {
      console.error('Failed to get channel info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get channel info'
      };
    }
  }

  /**
   * Get channel participants/members
   */
  async getChannelParticipants(channelId: string, limit: number = 100, filter: 'all' | 'admins' | 'kicked' | 'bots' | 'recent' = 'all'): Promise<{ success: boolean; participants?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const channel = await this.client.getEntity(channelId);
      
      if (!channel || !('broadcast' in channel || 'megagroup' in channel)) {
        return {
          success: false,
          error: 'Not a valid channel'
        };
      }

      // Create appropriate filter
      let participantsFilter: any;
      switch (filter) {
        case 'admins':
          participantsFilter = new Api.ChannelParticipantsAdmins();
          break;
        case 'kicked':
          participantsFilter = new Api.ChannelParticipantsKicked({ q: '' });
          break;
        case 'bots':
          participantsFilter = new Api.ChannelParticipantsBots();
          break;
        case 'recent':
          participantsFilter = new Api.ChannelParticipantsRecent();
          break;
        default:
          participantsFilter = new Api.ChannelParticipantsSearch({ q: '' });
      }

      const participants = await this.client.invoke(new Api.channels.GetParticipants({
        channel: channel,
        filter: participantsFilter,
        offset: 0,
        limit: limit,
        hash: BigInt(0)
      }));

      if (!('participants' in participants)) {
        return {
          success: true,
          participants: []
        };
      }

      return {
        success: true,
        participants: participants.participants.map((participant: any) => {
          const user = participants.users.find((u: any) => u.id?.toString() === participant.userId?.toString()) as any;
          return {
            user_id: participant.userId?.toString(),
            username: user?.username || undefined,
            first_name: user?.firstName || undefined,
            last_name: user?.lastName || undefined,
            is_bot: user?.bot || false,
            is_premium: user?.premium || false,
            date: participant.date,
            inviter_id: participant.inviterId?.toString(),
            promoted_by: participant.promotedBy?.toString(),
            kicked_by: participant.kickedBy?.toString(),
            rank: participant.rank,
            admin_rights: participant.adminRights,
            is_self: participant.self,
            is_creator: participant.isCreator,
            is_admin: participant.adminRights !== undefined
          };
        })
      };
    } catch (error: any) {
      console.error('Failed to get channel participants:', error);
      return {
        success: false,
        error: error.message || 'Failed to get channel participants'
      };
    }
  }

  /**
   * Search for channels/groups
   */
  async searchChannels(query: string, limit: number = 20): Promise<{ success: boolean; channels?: TelegramChannel[]; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.contacts.Search({
        q: query,
        limit: limit
      }));

      const channels: TelegramChannel[] = result.chats
        .filter((chat: any) => chat.broadcast || chat.megagroup || chat.gigagroup)
        .map((chat: any) => ({
          id: chat.id?.toString() || '',
          title: chat.title || '',
          username: chat.username || undefined,
          description: undefined, // Not available in search results
          participants_count: chat.participantsCount || undefined,
          is_verified: chat.verified || false,
          is_scam: chat.scam || false,
          is_fake: chat.fake || false,
          type: this.getChannelType(chat)
        }));

      return {
        success: true,
        channels
      };
    } catch (error: any) {
      console.error('Failed to search channels:', error);
      return {
        success: false,
        error: error.message || 'Failed to search channels'
      };
    }
  }

  /**
   * Join a channel
   */
  async joinChannel(channelId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const channel = await this.client.getEntity(channelId);
      await this.client.invoke(new Api.channels.JoinChannel({
        channel: channel
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to join channel:', error);
      return {
        success: false,
        error: error.message || 'Failed to join channel'
      };
    }
  }

  /**
   * Leave a channel
   */
  async leaveChannel(channelId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      const channel = await this.client.getEntity(channelId);
      await this.client.invoke(new Api.channels.LeaveChannel({
        channel: channel
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to leave channel:', error);
      return {
        success: false,
        error: error.message || 'Failed to leave channel'
      };
    }
  }

  private getChannelType(chat: any): 'channel' | 'supergroup' | 'group' {
    if (chat.broadcast) {
      return 'channel';
    } else if (chat.megagroup) {
      return 'supergroup';
    } else {
      return 'group';
    }
  }
}
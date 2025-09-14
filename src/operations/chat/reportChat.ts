import { TelegramClient } from 'telegram';
import { Api } from 'telegram/tl';

export class ReportChatOperation {
  constructor(private client: TelegramClient) {}

  async reportChat(chatId: string | number, reason: string, comment?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.client.connect();

      const entity = await this.client.getEntity(chatId);
      
      // Map reason to Telegram's report reason enum
      let reportReason;
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
        default:
          reportReason = new Api.InputReportReasonOther();
      }

      await this.client.invoke(new Api.messages.Report({
        peer: entity,
        id: [],
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

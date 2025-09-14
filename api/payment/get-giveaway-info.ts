import { TelegramService } from '../../src/telegramService';
import { createApiHandler } from '../../src/utils/apiHandler';

export default createApiHandler(
  async (telegramService: TelegramService, req) => {
    const { peer, msgId } = req.body;

    if (!peer || !msgId) {
      throw new Error('peer and msgId are required');
    }

    return await telegramService.payment.getGiveawayInfo(peer, msgId);
  },
  {
    requireBody: true,
    requiredBodyFields: ['peer', 'msgId']
  }
);

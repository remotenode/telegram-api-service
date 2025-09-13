export interface TelegramConfig {
  apiId: number;
  apiHash: string;
  sessionString: string;
  userId: string;
}

export interface SendGiftRequest {
  recipientId: string;
  giftId: string;
  isChannel?: boolean;
}

export interface SendGiftResponse {
  success: boolean;
  error?: string;
  messageId?: string;
}

export interface GetGiftsResponse {
  success: boolean;
  gifts?: TelegramGift[];
  error?: string;
}

export interface TelegramGift {
  id: string;
  gift_type: string;
  stars: number;
  availability: number;
}

export interface GetBalanceResponse {
  success: boolean;
  balance?: { stars: number };
  error?: string;
}

export interface ValidateSessionResponse {
  success: boolean;
  isValid: boolean;
  userInfo?: any;
  error?: string;
}

export interface GetSimilarChannelsRequest {
  channelId: string;
  limit?: number;
}

export interface GetSimilarChannelsResponse {
  success: boolean;
  channels?: TelegramChannel[];
  error?: string;
}

export interface TelegramChannel {
  id: string;
  title: string;
  username?: string;
  description?: string;
  participants_count?: number;
  is_verified?: boolean;
  is_scam?: boolean;
  is_fake?: boolean;
  photo?: string;
  type: 'channel' | 'supergroup' | 'group';
}


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


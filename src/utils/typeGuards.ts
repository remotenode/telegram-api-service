import { Api } from 'telegram/tl';

// Type guards for different chat types
export function isChannel(chat: any): chat is Api.Channel {
  return chat && (chat.broadcast === true || chat.megagroup === true);
}

export function isChat(chat: any): chat is Api.Chat {
  return chat && chat.className === 'Chat';
}

export function isUser(entity: any): entity is Api.User {
  return entity && entity.className === 'User';
}

export function isUserFull(user: any): user is Api.User {
  return user && user.className === 'User' && 'username' in user;
}

// Safely get property with fallback
export function safeGet<T, K extends keyof T>(obj: T | undefined, key: K, fallback?: T[K]): T[K] | undefined {
  return obj && key in obj ? obj[key] : fallback;
}

// Convert BigInt to regular number for API responses
export function bigIntToNumber(value: any): number | undefined {
  if (!value) return undefined;
  return typeof value === 'bigint' ? Number(value) : value;
}
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { TelegramConfig } from '../types';

export class BaseTelegramClient {
  protected client: TelegramClient;
  private isConnected: boolean = false;

  constructor(protected config: TelegramConfig) {
    // Validate session string is provided and not empty
    if (!config.sessionString || config.sessionString.trim() === '') {
      throw new Error('Session string is required and cannot be empty');
    }

    this.client = new TelegramClient(
      new StringSession(config.sessionString),
      config.apiId,
      config.apiHash,
      {
        connectionRetries: 5,
        timeout: 10000,
      }
    );
  }

  async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    try {
      await this.client.start({
        phoneNumber: async () => {
          throw new Error('Session string should be provided for initialization');
        },
        phoneCode: async () => {
          throw new Error('Session string should be provided for initialization');
        },
        password: async () => {
          throw new Error('Session string should be provided for initialization');
        },
        onError: (err) => {
          console.error('Telegram client error:', err);
        },
      });
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to initialize Telegram client:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }
}
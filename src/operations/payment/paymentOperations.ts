import { Api } from 'telegram/tl';
import { BaseTelegramClient } from '../../client/baseClient';

export class PaymentOperations extends BaseTelegramClient {
  /**
   * Get payment form for an invoice
   */
  async getPaymentForm(invoice: any): Promise<{ success: boolean; form?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const form = await this.client.invoke(new Api.payments.GetPaymentForm({
        invoice: invoice,
        themeParams: undefined
      }));

      return {
        success: true,
        form: {
          canSaveCredentials: form.canSaveCredentials,
          passwordMissing: form.passwordMissing,
          formId: form.formId?.toString(),
          botId: form.botId?.toString(),
          title: form.title,
          description: form.description,
          photo: form.photo,
          invoice: form.invoice,
          providerId: form.providerId?.toString(),
          url: form.url,
          nativeProvider: form.nativeProvider,
          nativeParams: form.nativeParams,
          savedInfo: form.savedInfo,
          savedCredentials: form.savedCredentials,
          users: form.users
        }
      };
    } catch (error: any) {
      console.error('Failed to get payment form:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment form'
      };
    }
  }

  /**
   * Send payment form
   */
  async sendPaymentForm(formId: string | bigint, invoice: any, requestedInfoId?: string, shippingOptionId?: string, credentials?: any, tipAmount?: number): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.SendPaymentForm({
        formId: BigInt(formId),
        invoice: invoice,
        requestedInfoId: requestedInfoId,
        shippingOptionId: shippingOptionId,
        credentials: credentials || new Api.InputPaymentCredentials({
          save: false,
          data: new Api.DataJSON({
            data: JSON.stringify({})
          })
        }),
        tipAmount: tipAmount
      }));

      return {
        success: true,
        result: {
          type: result.className,
          updates: 'updates' in result ? result.updates : undefined
        }
      };
    } catch (error: any) {
      console.error('Failed to send payment form:', error);
      return {
        success: false,
        error: error.message || 'Failed to send payment form'
      };
    }
  }

  /**
   * Get payment receipt
   */
  async getPaymentReceipt(msgId: number, peer?: any): Promise<{ success: boolean; receipt?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const peerId = peer || new Api.InputPeerEmpty();
      const receipt = await this.client.invoke(new Api.payments.GetPaymentReceipt({
        peer: peerId,
        msgId: msgId
      }));

      return {
        success: true,
        receipt: {
          date: receipt.date,
          botId: receipt.botId?.toString(),
          providerId: receipt.providerId?.toString(),
          title: receipt.title,
          description: receipt.description,
          photo: receipt.photo,
          invoice: receipt.invoice,
          info: receipt.info,
          shipping: receipt.shipping,
          currency: receipt.currency,
          totalAmount: receipt.totalAmount?.toString(),
          credentialsTitle: receipt.credentialsTitle,
          tipAmount: receipt.tipAmount?.toString(),
          users: receipt.users
        }
      };
    } catch (error: any) {
      console.error('Failed to get payment receipt:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment receipt'
      };
    }
  }

  /**
   * Get saved payment information
   */
  async getSavedInfo(): Promise<{ success: boolean; savedInfo?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.GetSavedInfo());

      return {
        success: true,
        savedInfo: {
          hasSavedCredentials: result.hasSavedCredentials,
          savedInfo: result.savedInfo ? {
            name: result.savedInfo.name,
            phone: result.savedInfo.phone,
            email: result.savedInfo.email,
            shippingAddress: result.savedInfo.shippingAddress
          } : undefined
        }
      };
    } catch (error: any) {
      console.error('Failed to get saved payment info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get saved payment info'
      };
    }
  }

  /**
   * Clear saved payment information
   */
  async clearSavedInfo(info?: boolean, credentials?: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      await this.ensureConnected();

      await this.client.invoke(new Api.payments.ClearSavedInfo({
        info: info,
        credentials: credentials
      }));

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Failed to clear saved payment info:', error);
      return {
        success: false,
        error: error.message || 'Failed to clear saved payment info'
      };
    }
  }

  /**
   * Get bank card data (for payment providers)
   */
  async getBankCardData(number: string): Promise<{ success: boolean; cardData?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.GetBankCardData({
        number: number
      }));

      return {
        success: true,
        cardData: {
          title: result.title,
          openUrls: result.openUrls
        }
      };
    } catch (error: any) {
      console.error('Failed to get bank card data:', error);
      return {
        success: false,
        error: error.message || 'Failed to get bank card data'
      };
    }
  }

  /**
   * Validate requested invoice info
   */
  async validateRequestedInfo(invoice: any, info: any, save?: boolean): Promise<{ success: boolean; validatedInfo?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.ValidateRequestedInfo({
        save: save,
        invoice: invoice,
        info: info
      }));

      return {
        success: true,
        validatedInfo: {
          id: result.id,
          shippingOptions: result.shippingOptions
        }
      };
    } catch (error: any) {
      console.error('Failed to validate requested info:', error);
      return {
        success: false,
        error: error.message || 'Failed to validate requested info'
      };
    }
  }

  /**
   * Export invoice
   */
  async exportInvoice(invoiceMedia: any): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.ExportInvoice({
        invoiceMedia: invoiceMedia
      }));

      return {
        success: true,
        url: result.url
      };
    } catch (error: any) {
      console.error('Failed to export invoice:', error);
      return {
        success: false,
        error: error.message || 'Failed to export invoice'
      };
    }
  }

  /**
   * Get premium gift code options
   */
  async getPremiumGiftCodeOptions(boostPeer?: any): Promise<{ success: boolean; options?: any[]; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.GetPremiumGiftCodeOptions({
        boostPeer: boostPeer
      }));

      return {
        success: true,
        options: result.map((option: any) => ({
          users: option.users,
          months: option.months,
          storeProduct: option.storeProduct,
          storeQuantity: option.storeQuantity,
          currency: option.currency,
          amount: option.amount?.toString()
        }))
      };
    } catch (error: any) {
      console.error('Failed to get premium gift code options:', error);
      return {
        success: false,
        error: error.message || 'Failed to get premium gift code options'
      };
    }
  }

  /**
   * Check gift code
   */
  async checkGiftCode(slug: string): Promise<{ success: boolean; giftCode?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.CheckGiftCode({
        slug: slug
      }));

      return {
        success: true,
        giftCode: {
          date: result.date,
          months: result.months,
          usedDate: result.usedDate,
          fromId: result.fromId?.toString(),
          toId: result.toId?.toString(),
          viaGiveaway: result.viaGiveaway,
          giveawayMsgId: result.giveawayMsgId,
          slug: result.slug,
          chats: result.chats,
          users: result.users
        }
      };
    } catch (error: any) {
      console.error('Failed to check gift code:', error);
      return {
        success: false,
        error: error.message || 'Failed to check gift code'
      };
    }
  }

  /**
   * Apply gift code
   */
  async applyGiftCode(slug: string): Promise<{ success: boolean; updates?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.ApplyGiftCode({
        slug: slug
      }));

      return {
        success: true,
        updates: result
      };
    } catch (error: any) {
      console.error('Failed to apply gift code:', error);
      return {
        success: false,
        error: error.message || 'Failed to apply gift code'
      };
    }
  }

  /**
   * Get giveaway info
   */
  async getGiveawayInfo(peer: any, msgId: number): Promise<{ success: boolean; giveaway?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.GetGiveawayInfo({
        peer: peer,
        msgId: msgId
      }));

      return {
        success: true,
        giveaway: {
          type: result.className,
          startDate: 'startDate' in result ? result.startDate : undefined,
          joinedTooEarlyDate: 'joinedTooEarlyDate' in result ? result.joinedTooEarlyDate : undefined,
          adminDisallowedChatId: 'adminDisallowedChatId' in result ? result.adminDisallowedChatId?.toString() : undefined,
          disallowedCountry: 'disallowedCountry' in result ? result.disallowedCountry : undefined,
          participating: 'participating' in result ? result.participating : undefined,
          finishDate: 'finishDate' in result ? result.finishDate : undefined,
          winnersCount: 'winnersCount' in result ? result.winnersCount : undefined,
          activatedCount: 'activatedCount' in result ? result.activatedCount : undefined
        }
      };
    } catch (error: any) {
      console.error('Failed to get giveaway info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get giveaway info'
      };
    }
  }

  /**
   * Launch prepaid giveaway
   */
  async launchPrepaidGiveaway(peer: any, giveawayId: string | bigint, purpose: any): Promise<{ success: boolean; updates?: any; error?: string }> {
    try {
      await this.ensureConnected();

      const result = await this.client.invoke(new Api.payments.LaunchPrepaidGiveaway({
        peer: peer,
        giveawayId: BigInt(giveawayId),
        purpose: purpose
      }));

      return {
        success: true,
        updates: result
      };
    } catch (error: any) {
      console.error('Failed to launch prepaid giveaway:', error);
      return {
        success: false,
        error: error.message || 'Failed to launch prepaid giveaway'
      };
    }
  }
}
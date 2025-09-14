import { VercelRequest, VercelResponse } from '@vercel/node';
import { TelegramService } from '../telegramService';

export interface TelegramCredentials {
  apiId: number;
  apiHash: string;
  sessionString: string;
  userId: string;
  accountType?: string;
}

export interface ApiHandlerOptions {
  requireBody?: boolean;
  requiredBodyFields?: string[];
  corsHeaders?: boolean;
}

/**
 * Extract Telegram credentials from request headers
 */
export function extractCredentials(req: VercelRequest): TelegramCredentials {
  const accountType = req.headers['x-account-type'] as string || 'pull';
  const apiId = req.headers['x-api-id'] as string;
  const apiHash = req.headers['x-api-hash'] as string;
  const sessionString = req.headers['x-session-string'] as string;
  const userId = req.headers['x-user-id'] as string;

  return {
    accountType,
    apiId: parseInt(apiId),
    apiHash,
    sessionString,
    userId
  };
}

/**
 * Validate Telegram credentials
 */
export function validateCredentials(credentials: TelegramCredentials): string | null {
  if (!credentials.apiId || !credentials.apiHash || !credentials.sessionString || !credentials.userId) {
    return 'Telegram credentials are required in headers (X-Api-Id, X-Api-Hash, X-Session-String, X-User-Id)';
  }

  if (!credentials.sessionString || credentials.sessionString.trim() === '') {
    return 'Valid session string is required in X-Session-String header';
  }

  return null;
}

/**
 * Validate request body fields
 */
export function validateBody(req: VercelRequest, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return `${field} is required in request body`;
    }
  }
  return null;
}

/**
 * Set CORS headers
 */
export function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Account-Type, X-Api-Id, X-Api-Hash, X-Session-String, X-User-Id');
}

/**
 * Handle OPTIONS request
 */
export function handleOptions(res: VercelResponse): boolean {
  res.status(200).end();
  return true;
}

/**
 * Handle method not allowed
 */
export function handleMethodNotAllowed(res: VercelResponse, allowedMethods: string[] = ['POST']): boolean {
  res.status(405).json({ 
    success: false,
    error: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}` 
  });
  return true;
}

/**
 * Handle validation errors
 */
export function handleValidationError(res: VercelResponse, error: string): boolean {
  res.status(400).json({
    success: false,
    error
  });
  return true;
}

/**
 * Handle server errors
 */
export function handleServerError(res: VercelResponse, error: any, context: string): boolean {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
  return true;
}

/**
 * Create a Telegram service instance
 */
export function createTelegramService(credentials: TelegramCredentials): TelegramService {
  return new TelegramService({
    apiId: credentials.apiId,
    apiHash: credentials.apiHash,
    sessionString: credentials.sessionString,
    userId: credentials.userId
  });
}

/**
 * Generic API handler that eliminates duplicate code
 */
export function createApiHandler<T = any>(
  handler: (telegramService: TelegramService, req: VercelRequest) => Promise<T>,
  options: ApiHandlerOptions = {}
) {
  return async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const { corsHeaders = true, requireBody = false, requiredBodyFields = [] } = options;

    try {
      // Set CORS headers
      if (corsHeaders) {
        setCorsHeaders(res);
      }

      // Handle OPTIONS request
      if (req.method === 'OPTIONS') {
        handleOptions(res);
        return;
      }

      // Check method
      if (req.method !== 'POST') {
        handleMethodNotAllowed(res);
        return;
      }

      // Extract and validate credentials
      const credentials = extractCredentials(req);
      const credentialError = validateCredentials(credentials);
      if (credentialError) {
        handleValidationError(res, credentialError);
        return;
      }

      // Validate body if required
      if (requireBody && requiredBodyFields.length > 0) {
        const bodyError = validateBody(req, requiredBodyFields);
        if (bodyError) {
          handleValidationError(res, bodyError);
          return;
        }
      }

      // Create Telegram service and execute handler
      const telegramService = createTelegramService(credentials);
      const result = await handler(telegramService, req);
      await telegramService.disconnect();

      // Return success response
      res.status(200).json(result);

    } catch (error: any) {
      handleServerError(res, error, 'API handler');
    }
  };
}

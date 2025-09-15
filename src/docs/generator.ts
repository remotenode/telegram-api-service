import swaggerJSDoc from 'swagger-jsdoc';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface ApiHandler {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters: any[];
  requestBody?: any;
  responses: any;
}

export class ApiDocGenerator {
  private apiHandlers: ApiHandler[] = [];

  constructor() {
    this.scanApiHandlers();
  }

  private scanApiHandlers() {
    const apiDir = join(process.cwd(), 'api');
    this.scanDirectory(apiDir, '');
  }

  private scanDirectory(dir: string, basePath: string) {
    const items = readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = join(dir, item.name);
      
      if (item.isDirectory()) {
        this.scanDirectory(fullPath, `${basePath}/${item.name}`);
      } else if (item.isFile() && item.name.endsWith('.ts') && item.name !== 'index.ts') {
        this.processApiFile(fullPath, basePath);
      }
    }
  }

  private processApiFile(filePath: string, basePath: string) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const endpoint = this.extractEndpointInfo(content, basePath);
      if (endpoint) {
        this.apiHandlers.push(endpoint);
      }
    } catch (error) {
      console.warn(`Could not process ${filePath}:`, error);
    }
  }

  private extractEndpointInfo(content: string, basePath: string): ApiHandler | null {
    // Extract endpoint path from file path
    const path = `/api${basePath}/${this.getFileName(content)}`;
    
    // Extract JSDoc comments
    const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (!jsdocMatch) return null;

    const jsdoc = jsdocMatch[0];
    
    // Extract summary and description
    const summaryMatch = jsdoc.match(/@summary\s+(.+)/);
    const descriptionMatch = jsdoc.match(/@description\s+(.+)/);
    
    const summary = summaryMatch ? summaryMatch[1].trim() : this.generateSummary(path);
    const description = descriptionMatch ? descriptionMatch[1].trim() : summary;

    // Extract parameters from JSDoc
    const parameters = this.extractParameters(jsdoc);
    
    // Extract request body from JSDoc
    const requestBody = this.extractRequestBody(jsdoc);
    
    // Generate responses based on the operation
    const responses = this.generateResponses(path);

    return {
      path,
      method: 'post', // All our endpoints are POST
      summary,
      description,
      parameters,
      requestBody,
      responses
    };
  }

  private getFileName(content: string): string {
    // Extract filename from import path or use a default
    const importMatch = content.match(/from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      const parts = importPath.split('/');
      return parts[parts.length - 1].replace('.ts', '');
    }
    return 'unknown';
  }

  private generateSummary(path: string): string {
    const parts = path.split('/').filter(p => p && p !== 'api');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private extractParameters(jsdoc: string): any[] {
    const params: any[] = [];
    
    // Standard Telegram auth headers
    params.push(
      {
        name: 'X-Api-Id',
        in: 'header',
        required: true,
        schema: { type: 'string' },
        description: 'Telegram API ID'
      },
      {
        name: 'X-Api-Hash',
        in: 'header',
        required: true,
        schema: { type: 'string' },
        description: 'Telegram API Hash'
      },
      {
        name: 'X-Session-String',
        in: 'header',
        required: true,
        schema: { type: 'string' },
        description: 'Telegram session string'
      },
      {
        name: 'X-User-Id',
        in: 'header',
        required: true,
        schema: { type: 'string' },
        description: 'Telegram user ID'
      }
    );

    return params;
  }

  private extractRequestBody(jsdoc: string): any {
    // Extract @param tags to build request body schema
    const paramMatches = jsdoc.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+(.+)/g);
    if (!paramMatches) return undefined;

    const properties: any = {};
    const required: string[] = [];

    for (const match of paramMatches) {
      const paramMatch = match.match(/@param\s+\{([^}]+)\}\s+(\w+)\s+(.+)/);
      if (paramMatch) {
        const [, type, name, description] = paramMatch;
        properties[name] = {
          type: this.mapJSDocType(type),
          description: description.trim()
        };
        
        if (!description.includes('optional') && !description.includes('?')) {
          required.push(name);
        }
      }
    }

    if (Object.keys(properties).length === 0) return undefined;

    return {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required,
            properties
          }
        }
      }
    };
  }

  private mapJSDocType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'object': 'object',
      'array': 'array',
      'string[]': 'array',
      'number[]': 'array'
    };
    
    return typeMap[type] || 'string';
  }

  private generateResponses(path: string): any {
    const responseSchema = this.getResponseSchema(path);
    
    return {
      '200': {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: responseSchema
          }
        }
      },
      '400': {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' }
          }
        }
      },
      '401': {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' }
          }
        }
      },
      '500': {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' }
          }
        }
      }
    };
  }

  private getResponseSchema(path: string): any {
    // Map paths to response schemas
    const schemaMap: { [key: string]: string } = {
      '/api/users/validate-session': 'ValidateSessionResponse',
      '/api/users/get-users': 'GetUsersResponse',
      '/api/users/update-profile': 'UpdateProfileResponse',
      '/api/channels/get-similar-channels': 'GetSimilarChannelsResponse',
      '/api/channels/get-channel-info': 'GetChannelInfoResponse',
      '/api/channels/search-channels': 'SearchChannelsResponse',
      '/api/chats/get-dialogs': 'GetDialogsResponse',
      '/api/chats/create-group': 'CreateGroupResponse',
      '/api/chats/archive-chat': 'ArchiveChatResponse',
      '/api/messages/send-message': 'SendMessageResponse',
      '/api/messages/get-messages': 'GetMessagesResponse',
      '/api/messages/get-message-history': 'GetMessageHistoryResponse',
      '/api/messages/edit-message': 'EditMessageResponse',
      '/api/media/download-media': 'DownloadMediaResponse',
      '/api/media/send-document': 'SendDocumentResponse',
      '/api/media/send-photo': 'SendPhotoResponse',
      '/api/payment/get-payment-form': 'GetPaymentFormResponse',
      '/api/payment/check-gift-code': 'CheckGiftCodeResponse'
    };

    const schemaName = schemaMap[path] || 'ApiResponse';
    return { $ref: `#/components/schemas/${schemaName}` };
  }

  public generateOpenAPISpec(): any {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Telegram API Service',
          version: '2.3.0',
          description: 'Comprehensive Telegram API service with automated documentation generation'
        },
        servers: [
          {
            url: 'https://telegram-api.aso.market',
            description: 'Production server'
          }
        ],
        components: {
          securitySchemes: {
            TelegramAuth: {
              type: 'apiKey',
              in: 'header',
              name: 'X-Api-Id',
              description: 'Telegram API credentials passed via headers'
            }
          },
          schemas: this.getBaseSchemas()
        },
        security: [{ TelegramAuth: [] }]
      },
      apis: [] // We'll generate paths manually
    };

    const spec: any = swaggerJSDoc(options);
    
    // Add our generated paths
    spec.paths = {};
    for (const handler of this.apiHandlers) {
      if (!spec.paths[handler.path]) {
        spec.paths[handler.path] = {};
      }
      spec.paths[handler.path][handler.method] = {
        summary: handler.summary,
        description: handler.description,
        security: [{ TelegramAuth: [] }],
        parameters: handler.parameters,
        requestBody: handler.requestBody,
        responses: handler.responses
      };
    }

    return spec;
  }

  private getBaseSchemas(): any {
    return {
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the operation was successful'
          },
          error: {
            type: 'string',
            description: 'Error message if operation failed'
          }
        }
      },
      ValidateSessionResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          isValid: { type: 'boolean' },
          userInfo: { type: 'object' },
          error: { type: 'string' }
        }
      },
      GetUsersResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          users: { type: 'array', items: { type: 'object' } },
          error: { type: 'string' }
        }
      },
      SendMessageResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'object' },
          error: { type: 'string' }
        }
      },
      GetMessagesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          messages: { type: 'array', items: { type: 'object' } },
          error: { type: 'string' }
        }
      }
      // Add more schemas as needed
    };
  }
}

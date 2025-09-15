import { readdirSync, readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters: any[];
  requestBody?: any;
  responses: any;
  tags: string[];
}

interface OperationMethod {
  name: string;
  returnType: string;
  parameters: Array<{
    name: string;
    type: string;
    optional: boolean;
    description?: string;
  }>;
}

export class AdvancedApiDocGenerator {
  private endpoints: ApiEndpoint[] = [];
  private operationMethods: Map<string, OperationMethod[]> = new Map();

  constructor() {
    this.scanApiHandlers();
    this.scanOperationClasses();
  }

  private scanApiHandlers() {
    const apiDir = join(process.cwd(), 'api');
    this.scanApiDirectory(apiDir, '');
  }

  private scanApiDirectory(dir: string, basePath: string) {
    try {
      const items = readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = join(dir, item.name);
        
        if (item.isDirectory()) {
          this.scanApiDirectory(fullPath, `${basePath}/${item.name}`);
        } else if (item.isFile() && item.name.endsWith('.ts') && item.name !== 'index.ts') {
          this.processApiFile(fullPath, basePath);
        }
      }
    } catch (error) {
      console.warn(`Could not scan directory ${dir}:`, error);
    }
  }

  private processApiFile(filePath: string, basePath: string) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const endpoint = this.extractEndpointFromApiFile(content, basePath, filePath);
      if (endpoint) {
        this.endpoints.push(endpoint);
      }
    } catch (error) {
      console.warn(`Could not process ${filePath}:`, error);
    }
  }

  private extractEndpointFromApiFile(content: string, basePath: string, filePath: string): ApiEndpoint | null {
    // Extract endpoint path from file path
    const fileName = filePath.split('/').pop()?.replace('.ts', '') || 'unknown';
    const path = `/api${basePath}/${fileName}`;
    
    // Extract JSDoc comments
    const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    const summary = this.extractSummary(jsdocMatch?.[0] || '', fileName);
    const description = this.extractDescription(jsdocMatch?.[0] || '', summary);
    
    // Extract request body from createApiHandler call
    const requestBody = this.extractRequestBodyFromHandler(content);
    
    // Generate responses based on the operation
    const responses = this.generateResponses(path);
    
    // Determine tags from path
    const tags = this.getTagsFromPath(path);

    return {
      path,
      method: 'post',
      summary,
      description,
      parameters: this.getStandardParameters(),
      requestBody,
      responses,
      tags
    };
  }

  private extractSummary(jsdoc: string, fileName: string): string {
    const summaryMatch = jsdoc.match(/@summary\s+(.+)/);
    if (summaryMatch) {
      return summaryMatch[1].trim();
    }
    
    // Generate from filename
    return fileName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private extractDescription(jsdoc: string, summary: string): string {
    const descriptionMatch = jsdoc.match(/@description\s+(.+)/);
    if (descriptionMatch) {
      return descriptionMatch[1].trim();
    }
    return summary;
  }

  private extractRequestBodyFromHandler(content: string): any {
    // Look for requiredBodyFields in createApiHandler
    const requiredFieldsMatch = content.match(/requiredBodyFields:\s*\[([^\]]+)\]/);
    if (!requiredFieldsMatch) return undefined;

    const requiredFields = requiredFieldsMatch[1]
      .split(',')
      .map(field => field.trim().replace(/['"]/g, ''));

    // Extract parameters from JSDoc
    const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
    if (!jsdocMatch) return undefined;

    const jsdoc = jsdocMatch[0];
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
        
        if (requiredFields.includes(name)) {
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

  private getStandardParameters(): any[] {
    return [
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
    ];
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
    // Map paths to response schemas based on actual operation return types
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

  private getTagsFromPath(path: string): string[] {
    const parts = path.split('/').filter(p => p && p !== 'api');
    return parts.length > 1 ? [parts[0]] : ['general'];
  }

  private scanOperationClasses() {
    const operationsDir = join(process.cwd(), 'src/operations');
    this.scanOperationsDirectory(operationsDir);
  }

  private scanOperationsDirectory(dir: string) {
    try {
      const items = readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = join(dir, item.name);
        
        if (item.isDirectory()) {
          this.scanOperationsDirectory(fullPath);
        } else if (item.isFile() && item.name.endsWith('.ts')) {
          this.processOperationFile(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Could not scan operations directory ${dir}:`, error);
    }
  }

  private processOperationFile(filePath: string) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const methods = this.extractOperationMethods(content);
      if (methods.length > 0) {
        const className = filePath.split('/').pop()?.replace('.ts', '') || 'unknown';
        this.operationMethods.set(className, methods);
      }
    } catch (error) {
      console.warn(`Could not process operation file ${filePath}:`, error);
    }
  }

  private extractOperationMethods(content: string): OperationMethod[] {
    const methods: OperationMethod[] = [];
    
    // Extract async method signatures
    const methodMatches = content.match(/async\s+(\w+)\s*\([^)]*\)\s*:\s*Promise<([^>]+)>/g);
    if (methodMatches) {
      for (const match of methodMatches) {
        const methodMatch = match.match(/async\s+(\w+)\s*\(([^)]*)\)\s*:\s*Promise<([^>]+)>/);
        if (methodMatch) {
          const [, name, params, returnType] = methodMatch;
          const parameters = this.parseMethodParameters(params);
          
          methods.push({
            name,
            returnType: returnType.trim(),
            parameters
          });
        }
      }
    }
    
    return methods;
  }

  private parseMethodParameters(params: string): Array<{ name: string; type: string; optional: boolean; description?: string }> {
    if (!params.trim()) return [];
    
    return params.split(',').map(param => {
      const trimmed = param.trim();
      const optional = trimmed.includes('?');
      const [name, type] = trimmed.split(':').map(s => s.trim());
      
      return {
        name: name.replace('?', ''),
        type: type || 'any',
        optional
      };
    });
  }

  public generateOpenAPISpec(): any {
    const spec = {
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
      tags: this.generateTags(),
      paths: this.generatePaths(),
      components: {
        securitySchemes: {
          TelegramAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-Api-Id',
            description: 'Telegram API credentials passed via headers'
          }
        },
        schemas: this.generateSchemas()
      },
      security: [{ TelegramAuth: [] }]
    };

    return spec;
  }

  private generateTags(): any[] {
    const tagSet = new Set<string>();
    this.endpoints.forEach(endpoint => {
      endpoint.tags.forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).map(tag => ({
      name: tag,
      description: `${tag.charAt(0).toUpperCase() + tag.slice(1)} operations`
    }));
  }

  private generatePaths(): any {
    const paths: any = {};
    
    for (const endpoint of this.endpoints) {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {};
      }
      
      paths[endpoint.path][endpoint.method] = {
        tags: endpoint.tags,
        summary: endpoint.summary,
        description: endpoint.description,
        security: [{ TelegramAuth: [] }],
        parameters: endpoint.parameters,
        requestBody: endpoint.requestBody,
        responses: endpoint.responses
      };
    }
    
    return paths;
  }

  private generateSchemas(): any {
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
    };
  }
}

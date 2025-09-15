import { VercelRequest, VercelResponse } from '@vercel/node';
import { AdvancedApiDocGenerator } from '../../src/docs/advanced-generator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const generator = new AdvancedApiDocGenerator();
    const spec = generator.generateOpenAPISpec();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(200).json(spec);
  } catch (error) {
    console.error('Error generating API docs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate API documentation' 
    });
  }
}

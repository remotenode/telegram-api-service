import { VercelRequest, VercelResponse } from '@vercel/node';
import openApiSpec from '../src/openapi-comprehensive.json';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    // Update server URL to current host
    const spec = JSON.parse(JSON.stringify(openApiSpec));
    
    // Get the host from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'telegram-api.aso.market';
    
    if (spec.servers && spec.servers.length > 0) {
      spec.servers[0].url = `${protocol}://${host}`;
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(spec);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

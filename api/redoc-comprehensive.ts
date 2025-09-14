import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  if (req.method === 'GET') {
    // Get the host from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'telegram-api.aso.market';
    const specUrl = `${protocol}://${host}/api/openapi-comprehensive`;
    
    // Serve ReDoc HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram API Service - Comprehensive API Documentation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      .header {
        background: #0088cc;
        color: white;
        padding: 1rem 2rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .header h1 {
        margin: 0;
        font-size: 1.8rem;
      }
      .header p {
        margin: 0.5rem 0 0 0;
        opacity: 0.9;
        font-size: 1rem;
      }
      .stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
        font-size: 0.9rem;
      }
      .stat {
        background: rgba(255,255,255,0.1);
        padding: 0.5rem 1rem;
        border-radius: 20px;
      }
      redoc {
        --redoc-color-primary: #0088cc;
        --redoc-color-primary-light: #4da6d9;
        --redoc-color-primary-dark: #006699;
      }
    </style>
</head>
<body>
    <div class="header">
      <h1>Telegram API Service</h1>
      <p>Comprehensive API Documentation with 41+ Endpoints</p>
      <div class="stats">
        <div class="stat">🔐 Authentication</div>
        <div class="stat">👥 Users</div>
        <div class="stat">📢 Channels</div>
        <div class="stat">💬 Chats</div>
        <div class="stat">📨 Messages</div>
        <div class="stat">📷 Media</div>
        <div class="stat">💳 Payments</div>
      </div>
    </div>
    <redoc spec-url="${specUrl}" 
           theme='{"colors":{"primary":{"main":"#0088cc"}}}'
           expand-responses="200,201"
           native-scrollbars="true"
           hide-download-button="false"
           disable-search="false"
           search-max-depth="10"
           json-sample-expand-level="2"
           hide-schema-pattern="false"
           show-object-schema-examples="true"
           sort-tags-alphabetically="true"
           sort-operations-alphabetically="true"
           menu-toggle="true"
           scroll-y-offset="80">
    </redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.1.3/bundles/redoc.standalone.js"></script>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

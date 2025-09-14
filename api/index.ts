import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  if (req.method === 'GET') {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram API Service</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: #f5f5f5;
        color: #333;
        line-height: 1.6;
      }
      .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
      }
      header {
        background: #0088cc;
        color: white;
        padding: 2rem 0;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      .subtitle {
        font-size: 1.2rem;
        opacity: 0.9;
      }
      .section {
        background: white;
        padding: 2rem;
        margin-bottom: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      h2 {
        font-size: 1.8rem;
        margin-bottom: 1rem;
        color: #0088cc;
      }
      .docs-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      .doc-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        text-decoration: none;
        color: inherit;
        display: block;
      }
      .doc-card:hover {
        border-color: #0088cc;
        box-shadow: 0 4px 8px rgba(0,136,204,0.1);
        transform: translateY(-2px);
      }
      .doc-card h3 {
        color: #0088cc;
        margin-bottom: 0.5rem;
      }
      .doc-card p {
        color: #666;
        font-size: 0.95rem;
      }
      .endpoints {
        margin-top: 1.5rem;
      }
      .endpoint {
        background: #f8f9fa;
        border-left: 4px solid #0088cc;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
      }
      .endpoint code {
        background: #e9ecef;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Consolas', 'Monaco', monospace;
      }
      .method {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: 3px;
        font-weight: bold;
        font-size: 0.85rem;
        margin-right: 0.5rem;
      }
      .method.post {
        background: #28a745;
        color: white;
      }
      .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      .tech-badge {
        background: #e9ecef;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.9rem;
      }
      footer {
        text-align: center;
        padding: 2rem;
        color: #666;
      }
    </style>
</head>
<body>
    <header>
      <div class="container">
        <h1>Telegram API Service</h1>
        <p class="subtitle">Real MTProto integration with modular architecture</p>
      </div>
    </header>

    <div class="container">
      <section class="section">
        <h2>📚 API Documentation</h2>
        <div class="docs-grid">
          <a href="/swagger" class="doc-card">
            <h3>🚀 Swagger UI</h3>
            <p>Interactive API documentation with all 41+ endpoints. Test endpoints directly from your browser with header-based authentication.</p>
          </a>
          <a href="/redoc" class="doc-card">
            <h3>📚 ReDoc</h3>
            <p>Clean, responsive, three-panel documentation with all available endpoints. Perfect for API reference and integration guides.</p>
          </a>
          <a href="/openapi" class="doc-card">
            <h3>📋 OpenAPI Spec</h3>
            <p>Complete OpenAPI 3.0 specification with all 41+ endpoints in JSON format. Import into your favorite API tools.</p>
          </a>
        </div>
      </section>

      <section class="section">
        <h2>🚀 Available Endpoints (41+ Total)</h2>
        <div class="endpoints">
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/validate-session</code>
            <p>Validates a Telegram session and returns detailed user information</p>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/users/*</code>
            <p>User management: get users, photos, blocked users, update profile</p>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/channels/*</code>
            <p>Channel operations: similar channels, info, participants, search, join/leave</p>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/chats/*</code>
            <p>Chat management: dialogs, create groups, archive, mute, report</p>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/messages/*</code>
            <p>Messaging: send, forward, delete, pin, mark as read, typing indicators</p>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/media/*</code>
            <p>Media operations: download, file info, set/delete chat photos</p>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <code>/api/payments/*</code>
            <p>Payment processing: forms, receipts, gift codes, giveaways, bank cards</p>
          </div>
        </div>
        <p style="margin-top: 1rem; text-align: center; color: #666;">
          <strong>View the comprehensive documentation above for detailed endpoint information and schemas.</strong>
        </p>
      </section>

      <section class="section">
        <h2>🛠️ Technology Stack</h2>
        <div class="tech-stack">
          <span class="tech-badge">TypeScript</span>
          <span class="tech-badge">Telegram MTProto</span>
          <span class="tech-badge">gramjs</span>
          <span class="tech-badge">Vercel</span>
          <span class="tech-badge">OpenAPI 3.0</span>
        </div>
      </section>

      <section class="section">
        <h2>📖 Quick Start</h2>
        <p>All endpoints require Telegram API credentials in the request headers for security:</p>
        <div class="endpoint">
          <code>Headers:
X-Api-Id: 12345
X-Api-Hash: your-api-hash
X-Session-String: your-session-string
X-User-Id: 123456789

Body:
{
  "channelId": "channel_username",
  "limit": 10
}</code>
        </div>
        <p style="margin-top: 1rem;">Check out the <a href="/swagger" style="color: #0088cc;">interactive documentation</a> for detailed examples and schemas.</p>
      </section>
    </div>

    <footer>
      <p>Telegram API Service &copy; 2024 | Built with ❤️ using real Telegram APIs</p>
    </footer>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
async function handler(req, res) {
    const host = req.headers['host'] || 'telegram-api.aso.market';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram API Service - Auto-Generated API Documentation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      .header {
        background: #28a745;
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
        --redoc-color-primary: #28a745;
        --redoc-color-primary-light: #5cb85c;
        --redoc-color-primary-dark: #1e7e34;
      }
    </style>
</head>
<body>
    <div class="header">
      <h1>Telegram API Service</h1>
      <p>Auto-Generated API Documentation - Updated automatically from code</p>
      <div class="stats">
        <div class="stat">🤖 Auto-Generated</div>
        <div class="stat">📊 50+ Endpoints</div>
        <div class="stat">🔄 Always Up-to-Date</div>
        <div class="stat">📝 JSDoc Comments</div>
      </div>
    </div>
    <redoc spec-url="${baseUrl}/api/docs/auto-generated" 
           theme='{"colors":{"primary":{"main":"#28a745"}}}'
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
}
//# sourceMappingURL=redoc-auto.js.map
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
    <title>Telegram API Service - Auto-Generated Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        background: #fafafa;
      }
      .swagger-ui .topbar {
        background-color: #0088cc;
      }
      .swagger-ui .topbar .download-url-wrapper {
        display: none;
      }
      .swagger-ui .info .title {
        color: #0088cc;
      }
      .auto-generated-banner {
        background: #28a745;
        color: white;
        padding: 10px;
        text-align: center;
        font-weight: bold;
        margin-bottom: 20px;
      }
    </style>
</head>
<body>
    <div class="auto-generated-banner">
      🤖 Auto-Generated Documentation - Updated automatically from code
    </div>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        const ui = SwaggerUIBundle({
          url: '${baseUrl}/api/docs/auto-generated',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout",
          tryItOutEnabled: true,
          requestInterceptor: (request) => {
            return request;
          },
          responseInterceptor: (response) => {
            return response;
          }
        });
      };
    </script>
</body>
</html>
  `;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
}
//# sourceMappingURL=swagger-auto.js.map
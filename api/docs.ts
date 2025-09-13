import { VercelRequest, VercelResponse } from '@vercel/node';
import openApiSpec from '../src/openapi.json';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  if (req.method === 'GET') {
    // Serve Swagger UI HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram API Service - Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
      body {
        margin: 0;
        background: #fafafa;
      }
      .swagger-ui .topbar {
        display: none;
      }
      .swagger-ui .info {
        margin-bottom: 50px;
      }
      .swagger-ui .info .title {
        color: #3b4151;
      }
      .swagger-ui .scheme-container {
        background: #fcfcfc;
        padding: 15px 0;
        margin-bottom: 20px;
        border-radius: 4px;
      }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" charset="UTF-8"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
    <script>
    window.onload = function() {
      const spec = ${JSON.stringify(openApiSpec, null, 2)};
      
      // Update server URL to current host
      if (spec.servers && spec.servers.length > 0) {
        const protocol = window.location.protocol;
        const host = window.location.host;
        spec.servers[0].url = protocol + '//' + host;
      }
      
      const ui = SwaggerUIBundle({
        spec: spec,
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
        validatorUrl: null,
        tryItOutEnabled: true,
        requestInterceptor: (request) => {
          // Add CORS headers if needed
          request.headers['Content-Type'] = 'application/json';
          return request;
        }
      });
      
      window.ui = ui;
    }
  </script>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  if (req.method === 'GET') {
    // Get the host from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['host'] || 'your-vercel-app.vercel.app';
    const specUrl = `${protocol}://${host}/api/openapi`;
    
    // Serve ReDoc HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram API Service - ReDoc Documentation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
</head>
<body>
    <redoc spec-url="${specUrl}"></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0/bundles/redoc.standalone.js"></script>
</body>
</html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
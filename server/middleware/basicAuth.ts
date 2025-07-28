import { defineEventHandler, setHeader, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  // Only apply the Basic Auth to routes starting with '/admin'
  if (!event.node.req.url?.startsWith('/admin')) {
    return;
  }

  const username = process.env.BASIC_AUTH_USERNAME || 'defaultUsername';
  const password = process.env.BASIC_AUTH_PASSWORD || 'defaultPassword';

  const headers = event.node.req.headers;
  const authHeader = headers['authorization'];

  // Check if the Authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    setHeader(event, 'WWW-Authenticate', 'Basic realm="Admin Area"');
    setResponseStatus(event, 401);
    return { message: 'Unauthorized' };
  }

  // Decode the base64 credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [inputUsername, inputPassword] = credentials.split(':');

  // Validate the credentials
  if (inputUsername === username && inputPassword === password) {
    return; // Continue with the request if credentials are valid
  }

  // If credentials are invalid, return a 401 response
  setResponseStatus(event, 401);
  return { message: 'Unauthorized' };
});

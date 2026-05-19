const codeSpaceName = process.env.REACT_APP_CODESPACE_NAME;
const apiHost = codeSpaceName
  ? `https://${codeSpaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export function getApiEndpoint(resource) {
  const endpoint = `${apiHost}/api/${resource}/`;
  console.log(`API endpoint for ${resource}:`, endpoint);
  return endpoint;
}

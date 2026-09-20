export async function onRequest(context) {
  const response = await context.next();
  const host = new URL(context.request.url).hostname.toLowerCase();
  const isNonProduction =
    host === "staging.learningbiologyforlife.org" ||
    host.endsWith(".pages.dev");

  if (!isNonProduction) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, follow");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

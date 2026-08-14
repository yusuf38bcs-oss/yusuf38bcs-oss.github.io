export const CERTIFICATION_HEADER_NAME = "x-lbfl-certification";
export const CERTIFICATION_HOSTS = Object.freeze([
  "api.learningbiologyforlife.org",
  "learningbiologyforlife.org",
]);

const CERTIFICATION_HOST_SET = new Set(CERTIFICATION_HOSTS);
const TOKEN_PATTERN = /^[0-9a-f]{64}$/;

export function requireCertificationToken(value) {
  const token = typeof value === "string" ? value : "";
  if (!TOKEN_PATTERN.test(token)) {
    throw new Error("Production certification credential is missing or invalid");
  }
  return token;
}

export function certificationHeadersForUrl(rawUrl, headers, token) {
  const validatedToken = requireCertificationToken(token);
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    url.port !== "" ||
    !CERTIFICATION_HOST_SET.has(url.hostname.toLowerCase())
  ) {
    return null;
  }

  return {
    ...(headers || {}),
    [CERTIFICATION_HEADER_NAME]: validatedToken,
  };
}

export function sanitizeRecordedHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers || {}).filter(
      ([name]) => name.toLowerCase() !== CERTIFICATION_HEADER_NAME,
    ),
  );
}

export function assertCertificationTokenAbsent(value, token, label) {
  const validatedToken = requireCertificationToken(token);
  if (String(value).includes(validatedToken)) {
    throw new Error(`${label} contains the production certification credential`);
  }
}

export async function installCertificationBypassRoute(context, token) {
  const validatedToken = requireCertificationToken(token);
  await context.route("**/*", async (route) => {
    const request = route.request();
    const headers = certificationHeadersForUrl(
      request.url(),
      request.headers(),
      validatedToken,
    );
    if (headers) {
      await route.continue({ headers });
      return;
    }
    await route.continue();
  });
}

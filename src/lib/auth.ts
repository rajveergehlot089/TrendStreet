export const SESSION_COOKIE_NAME = "ts_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[FATAL SECURITY] AUTH_SECRET environment variable is missing in production environment."
      );
    }
    return "trend_street_luxury_menswear_dev_fallback_secret_key_2026_non_prod";
  }
  return secret;
}

export interface SessionPayload {
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a cryptographically signed session token: base64(payload).signature
 * Runs natively in both Node.js and Edge Runtime.
 */
export async function signSessionToken(email: string): Promise<string> {
  const payload: SessionPayload = {
    email,
    role: "admin",
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const enc = new TextEncoder();
  const payloadStr = uint8ArrayToBase64Url(enc.encode(JSON.stringify(payload)));
  const key = await getHmacKey();
  const signatureBytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(payloadStr))
  );
  const signature = uint8ArrayToBase64Url(signatureBytes);

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies a signed session token. Returns payload if valid, or null if tampered/expired.
 * Runs natively in both Node.js and Edge Runtime.
 */
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadStr, signatureStr] = parts;

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey();
    const signatureBytes = base64UrlToUint8Array(signatureStr);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadStr)
    );

    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadStr));
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

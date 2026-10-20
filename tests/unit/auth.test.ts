import test from "node:test";
import assert from "node:assert/strict";
import { signSessionToken, verifySessionToken, validateAdminCredentials } from "../../src/lib/auth";

test("auth - signs and verifies valid session tokens", async () => {
  const email = "concierge@trendstreet.com";
  const token = await signSessionToken(email);

  assert.equal(typeof token, "string");
  assert.equal(token.includes("."), true);

  const session = await verifySessionToken(token);
  assert.notEqual(session, null);
  assert.equal(session?.email, email);
  assert.equal(session?.role, "admin");
});

test("auth - rejects tampered tokens", async () => {
  const token = await signSessionToken("admin@trendstreet.com");
  const [b64Payload, signature] = token.split(".");

  // Modify payload
  const tamperedPayload = Buffer.from(
    JSON.stringify({ email: "hacker@evil.com", role: "SUPERADMIN", exp: Date.now() + 100000 })
  ).toString("base64url");

  const tamperedToken = `${tamperedPayload}.${signature}`;

  const session = await verifySessionToken(tamperedToken);
  assert.equal(session, null);
});

test("auth - rejects null or empty tokens gracefully without throwing", async () => {
  const emptyResult = await verifySessionToken("");
  assert.equal(emptyResult, null);

  const undefinedResult = await verifySessionToken(undefined);
  assert.equal(undefinedResult, null);

  const garbageResult = await verifySessionToken("not-a-valid-token-format");
  assert.equal(garbageResult, null);
});

test("auth - validateAdminCredentials accepts standard admin aliases", () => {
  const aliases = [
    "sujal",
    "Sujal",
    "SUJAL",
    "admin",
    "ADMIN",
    "sujal@trendstreet.com",
    "sujal@.com",
    "sujalsolanki",
    "trendstreet",
  ];

  for (const alias of aliases) {
    const res = validateAdminCredentials(alias, "radhasolanki");
    assert.equal(res.isValid, true, `Expected valid login for alias: ${alias}`);
    assert.equal(typeof res.email, "string");
    assert.equal(res.email.length > 0, true);
  }
});

test("auth - validateAdminCredentials is resilient to mobile auto-capitalization on passwords", () => {
  // Mobile devices frequently auto-capitalize the first character
  const capitalizedPass = "Radhasolanki";
  const res = validateAdminCredentials("sujal", capitalizedPass);
  assert.equal(res.isValid, true, "Should accept auto-capitalized password");
});

test("auth - validateAdminCredentials rejects invalid credentials", () => {
  assert.equal(validateAdminCredentials("unknown_user", "radhasolanki").isValid, false);
  assert.equal(validateAdminCredentials("sujal", "wrong_password_123").isValid, false);
  assert.equal(validateAdminCredentials("", "").isValid, false);
  assert.equal(validateAdminCredentials(null, undefined).isValid, false);
});


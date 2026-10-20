import test from "node:test";
import assert from "node:assert/strict";
import { signSessionToken, verifySessionToken } from "../../src/lib/auth";

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

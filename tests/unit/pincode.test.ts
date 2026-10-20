import test from "node:test";
import assert from "node:assert/strict";
import { isValidIndianPincode, checkPincodeServiceability } from "../../src/lib/pincode";

test("isValidIndianPincode - accepts valid 6-digit Indian PIN codes", () => {
  assert.equal(isValidIndianPincode("400050"), true); // Mumbai Bandra
  assert.equal(isValidIndianPincode("110001"), true); // New Delhi Connaught Place
  assert.equal(isValidIndianPincode("560001"), true); // Bengaluru
  assert.equal(isValidIndianPincode("600001"), true); // Chennai
  assert.equal(isValidIndianPincode("700001"), true); // Kolkata
  assert.equal(isValidIndianPincode("500001"), true); // Hyderabad
});

test("isValidIndianPincode - rejects invalid or malformed PIN codes", () => {
  assert.equal(isValidIndianPincode("012345"), false); // Starts with 0
  assert.equal(isValidIndianPincode("40005"), false);  // 5 digits
  assert.equal(isValidIndianPincode("4000501"), false); // 7 digits
  assert.equal(isValidIndianPincode("40005A"), false); // Alphanumeric
  assert.equal(isValidIndianPincode(""), false);       // Empty
  assert.equal(isValidIndianPincode("SW1A 1AA"), false); // UK postcode
  assert.equal(isValidIndianPincode("90210"), false);   // US zip code
});

test("checkPincodeServiceability - resolves Metro cities to Blue Dart Apex / Delhivery Air (2-3 days)", () => {
  const result = checkPincodeServiceability("400050"); // Bandra West, Mumbai

  assert.equal(result.isValid, true);
  assert.equal(result.isServiceable, true);
  assert.equal(result.tier, "Metro");
  assert.equal(result.city, "Mumbai");
  assert.equal(result.state, "Maharashtra");
  assert.equal(result.transitDaysMin, 2);
  assert.equal(result.transitDaysMax, 3);
  assert.equal(result.codAvailable, true);
  assert.equal(result.freeShippingThreshold, 1999);
  assert.match(result.courierPartner, /Blue Dart|Delhivery/);
});

test("checkPincodeServiceability - resolves Tier 1 hubs with 3-4 day transit", () => {
  const result = checkPincodeServiceability("122001"); // Gurugram / Haryana

  assert.equal(result.isValid, true);
  assert.equal(result.isServiceable, true);
  assert.equal(result.tier, "Tier 1");
  assert.equal(result.state, "Haryana");
  assert.equal(result.transitDaysMin, 3);
  assert.equal(result.transitDaysMax, 4);
});

test("checkPincodeServiceability - provides fallback for Rest of India valid PINs", () => {
  // A valid Indian PIN code not explicitly in the top postal circle table (e.g. 799001 Agartala, Tripura)
  const result = checkPincodeServiceability("799001");

  assert.equal(result.isValid, true);
  assert.equal(result.isServiceable, true);
  assert.equal(result.tier, "Rest of India");
  assert.equal(result.transitDaysMin, 4);
  assert.equal(result.transitDaysMax, 6);
  assert.equal(result.codAvailable, true);
});

test("checkPincodeServiceability - gracefully flags invalid PIN codes with helpful message", () => {
  const result = checkPincodeServiceability("invalid");

  assert.equal(result.isValid, false);
  assert.equal(result.isServiceable, false);
  assert.match(result.message, /valid 6-digit Indian PIN/i);
});

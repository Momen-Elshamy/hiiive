// node --test "lib/*.test.mjs"
import test from "node:test";
import assert from "node:assert/strict";
import { redirectLocale, redirectTarget } from "./redirects.js";

test("unprefixed URLs look up the default locale's redirects", () => {
  // Slug renames file their redirect under the page's locale ("en"), so a
  // lookup for an unprefixed URL must ask for "en", not for no locale.
  assert.equal(redirectLocale(null), "en");
  assert.equal(redirectLocale(undefined), "en");
});

test("prefixed URLs look up their own locale", () => {
  assert.equal(redirectLocale("de"), "de");
});

test("the visitor's language prefix is put back on the target", () => {
  assert.equal(redirectTarget("/ai-engineering", null), "/ai-engineering");
  assert.equal(redirectTarget("/ai-engineering", "de"), "/de/ai-engineering");
  assert.equal(redirectTarget("/de/ai-engineering", "de"), "/de/ai-engineering");
  assert.equal(redirectTarget("/de", "de"), "/de");
  assert.equal(redirectTarget("/delivery", "de"), "/de/delivery");
});

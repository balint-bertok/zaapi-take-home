/**
 * Secrets invariant, the in-repo half (gitleaks over the full history is the other half, in
 * scripts/gate, the pre-commit hook and CI).
 * - `.env`, the only secret store, must stay git-ignored, or one `git add .` publishes it.
 * - No credential-shaped literal may sit in src/: whatever is in src/ ships to a public web page.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const credentialShapes: [string, RegExp][] = [
  ["OpenAI-style key", /sk-[A-Za-z0-9_-]{20,}/],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9]{36}/],
  ["AWS access key id", /AKIA[0-9A-Z]{16}/],
];

describe("secrets", () => {
  it(".env is git-ignored", () => {
    // check-ignore exits non-zero (and execFileSync throws) when the path is NOT ignored.
    expect(execFileSync("git", ["check-ignore", ".env"]).toString().trim()).toBe(".env");
  });

  it("no credential-shaped literal in src/", () => {
    const files = readdirSync("src", { recursive: true, encoding: "utf8" })
      .map((f) => join("src", f))
      .filter((f) => statSync(f).isFile());
    const hits = files.flatMap((file) => {
      const text = readFileSync(file, "utf8");
      return credentialShapes.filter(([, re]) => re.test(text)).map(([name]) => `${file}: ${name}`);
    });
    expect(hits).toEqual([]);
  });
});

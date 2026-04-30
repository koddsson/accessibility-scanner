import { writeFile, readFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";

const SOURCE_URL =
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json";
const OUTPUT_PATH = "./testcases.json";
const FIXTURES_DIR = "./tests/act/fixtures";
const FIXTURE_DOWNLOAD_CONCURRENCY = 8;

interface Testcase {
  ruleId: string;
  testcaseId: string;
  url: string;
}

interface Testcases {
  count: number;
  testcases: Testcase[];
  [key: string]: unknown;
}

const previous: Testcases | null = await readFile(OUTPUT_PATH, "utf8")
  .then((src) => JSON.parse(src) as Testcases)
  .catch(() => null);

const response = await fetch(SOURCE_URL);
if (!response.ok) {
  throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status} ${response.statusText}`);
}

const next = (await response.json()) as Testcases;
if (!Array.isArray(next.testcases)) {
  throw new Error("Unexpected payload: missing 'testcases' array");
}

await writeFile(OUTPUT_PATH, JSON.stringify(next, null, 2), "utf8");

const prevCount = previous?.testcases.length ?? 0;
const nextCount = next.testcases.length;
const prevRules = new Set(previous?.testcases.map((t) => t.ruleId) ?? []);
const nextRules = new Set(next.testcases.map((t) => t.ruleId));

console.log(`Wrote ${OUTPUT_PATH}: ${nextCount} testcases (${nextCount - prevCount >= 0 ? "+" : ""}${nextCount - prevCount}).`);
console.log(`Rules: ${nextRules.size} (${nextRules.size - prevRules.size >= 0 ? "+" : ""}${nextRules.size - prevRules.size}).`);

const added = [...nextRules].filter((id) => !prevRules.has(id));
const removed = [...prevRules].filter((id) => !nextRules.has(id));
if (added.length) console.log(`Added rules: ${added.join(", ")}`);
if (removed.length) console.log(`Removed rules: ${removed.join(", ")}`);

// Download any fixture HTML files referenced by the synced testcases that
// aren't already on disk.  generate-act-tests.js reads these as the
// `testcases.json`/fixture pairing is the source of truth for what the
// scanner is measured against.
await mkdir(FIXTURES_DIR, { recursive: true });

const missing: Testcase[] = [];
for (const tc of next.testcases) {
  try {
    await access(`${FIXTURES_DIR}/${tc.testcaseId}.html`, constants.F_OK);
  } catch {
    missing.push(tc);
  }
}

if (missing.length > 0) {
  console.log(`Downloading ${missing.length} missing fixture${missing.length === 1 ? "" : "s"}…`);
  for (let i = 0; i < missing.length; i += FIXTURE_DOWNLOAD_CONCURRENCY) {
    const batch = missing.slice(i, i + FIXTURE_DOWNLOAD_CONCURRENCY);
    await Promise.all(
      batch.map(async (tc) => {
        const res = await fetch(tc.url);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${tc.url}: ${res.status} ${res.statusText}`);
        }
        const html = await res.text();
        await writeFile(`${FIXTURES_DIR}/${tc.testcaseId}.html`, html, "utf8");
      }),
    );
  }
  console.log(`Downloaded ${missing.length} fixture${missing.length === 1 ? "" : "s"}.`);
} else {
  console.log("All fixtures already present.");
}

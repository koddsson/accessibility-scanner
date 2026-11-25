import {
  writeFile,
  readFile,
  readdir,
  mkdir,
  access,
} from "node:fs/promises";
import { constants } from "node:fs";
import { dirname } from "node:path";

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

// ACT examples load shared assets by absolute path. The test runner serves
// them from ASSETS_DIR; media files there are git-ignored because of their size.
const ASSET_PREFIX = "/WAI/content-assets/wcag-act-rules/test-assets/";
const ASSET_PATTERN = new RegExp(`${ASSET_PREFIX}[^"'\\s)>#?]+`, "g");
const ASSETS_DIR = "./tests/act/assets";
const CRAWLED_EXTENSIONS = new Set(["html", "css", "js"]);

function extensionOf(path: string): string {
  const name = path.slice(path.lastIndexOf("/") + 1);
  return name.includes(".") ? name.slice(name.lastIndexOf(".") + 1) : "";
}

function assetPathsIn(source: string): string[] {
  return (source.match(ASSET_PATTERN) ?? []).filter(
    (path) => extensionOf(path) !== "",
  );
}

const pending = new Set<string>();
for (const name of await readdir(FIXTURES_DIR)) {
  const source = await readFile(`${FIXTURES_DIR}/${name}`, "utf8");
  for (const path of assetPathsIn(source)) pending.add(path);
}

const seen = new Set<string>();
let downloadedAssets = 0;
const unavailableAssets: string[] = [];

async function syncAsset(path: string): Promise<string[]> {
  const target = `${ASSETS_DIR}/${path.slice(ASSET_PREFIX.length)}`;
  const crawl = CRAWLED_EXTENSIONS.has(extensionOf(path));

  const existing = await readFile(target).catch(() => null);
  if (existing) return crawl ? assetPathsIn(existing.toString("utf8")) : [];

  const res = await fetch(`https://www.w3.org${path}`);
  if (!res.ok) {
    unavailableAssets.push(path);
    return [];
  }
  const body = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
  downloadedAssets++;
  return crawl ? assetPathsIn(body.toString("utf8")) : [];
}

while (pending.size > 0) {
  const batch = [...pending].slice(0, FIXTURE_DOWNLOAD_CONCURRENCY);
  for (const path of batch) {
    pending.delete(path);
    seen.add(path);
  }
  const discovered = await Promise.all(batch.map((path) => syncAsset(path)));
  for (const path of discovered.flat()) {
    if (!seen.has(path)) pending.add(path);
  }
}

console.log(
  downloadedAssets > 0
    ? `Downloaded ${downloadedAssets} shared asset${downloadedAssets === 1 ? "" : "s"}.`
    : "All shared assets already present.",
);
if (unavailableAssets.length > 0) {
  console.log(`Not available upstream: ${unavailableAssets.join(", ")}`);
}

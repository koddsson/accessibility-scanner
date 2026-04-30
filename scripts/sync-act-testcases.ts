import { writeFile, readFile } from "node:fs/promises";

const SOURCE_URL =
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json";
const OUTPUT_PATH = "./testcases.json";

interface Testcases {
  count: number;
  testcases: { ruleId: string }[];
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

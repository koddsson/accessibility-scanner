import { writeFile, readFile, readdir, access, constants } from "node:fs/promises";
import { tablemark } from "tablemark";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

interface AxeRule {
  id: string;
  url: string;
  Description: string;
  Impact: string;
  Tags: string;
  "Issue Type": string;
  "ACT Rules": string;
}

interface RulesJson {
  [section: string]: {
    description: string;
    rules: AxeRule[];
  };
}

interface ActTestcase {
  ruleId: string;
  ruleName: string;
  testcaseId: string;
  expected: "passed" | "failed" | "inapplicable";
  ruleAccessibilityRequirements?: Record<string, unknown>;
}

const rulesJson: RulesJson = JSON.parse(await readFile("./rules.json", "utf8"));
const { testcases } = JSON.parse(await readFile("./testcases.json", "utf8")) as {
  testcases: ActTestcase[];
};

// Set of implemented scanner rule files (filenames without .ts).
const implementedFiles = new Set(
  (await readdir("./src/rules/"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, "")),
);

// Build map: ACT rule id -> set of axe-core rule ids that reference it.
const actToAxe = new Map<string, Set<string>>();
const ACT_LINK_RE = /\[([a-z0-9]+)\]\(https:\/\/act-rules\.github\.io\/rules\/[a-z0-9]+\)/g;
for (const { rules } of Object.values(rulesJson)) {
  for (const rule of rules) {
    const actField = String(rule["ACT Rules"] ?? "");
    for (const match of actField.matchAll(ACT_LINK_RE)) {
      const actId = match[1];
      if (!actToAxe.has(actId)) actToAxe.set(actId, new Set());
      actToAxe.get(actId)!.add(rule.id);
    }
  }
}

// Aggregate ACT testcases by rule id.
const testcasesByRule = new Map<string, ActTestcase[]>();
for (const tc of testcases) {
  if (!testcasesByRule.has(tc.ruleId)) testcasesByRule.set(tc.ruleId, []);
  testcasesByRule.get(tc.ruleId)!.push(tc);
}

// ACT rules not present in testcases.json. testcases.json only contains rules
// with published test fixtures, so deprecated rules and brand-new proposals
// are missing. Keep this list in sync with
// https://www.w3.org/WAI/standards-guidelines/act/rules/.
const extraActRules: {
  id: string;
  name: string;
  wcag: string[];
  status: "deprecated" | "proposed";
}[] = [
  {
    id: "5b7ae0",
    name: "HTML page lang and xml:lang attributes have matching values",
    wcag: ["3.1.1"],
    status: "deprecated",
  },
  {
    id: "9eb3f6",
    name: "Image filename is accessible name for image",
    wcag: ["1.1.1"],
    status: "proposed",
  },
  {
    id: "kb1m8s",
    name: "ARIA global properties not used where prohibited",
    wcag: ["4.1.2"],
    status: "proposed",
  },
];
for (const extra of extraActRules) {
  if (!testcasesByRule.has(extra.id)) testcasesByRule.set(extra.id, []);
}

// Count generated test files and skipped cases per ACT rule.
async function countActTests(ruleId: string): Promise<{ generated: number; skipped: number }> {
  const dir = `./tests/act/tests/${ruleId}`;
  if (!(await fileExists(dir))) return { generated: 0, skipped: 0 };
  const files = (await readdir(dir)).filter((f) => f.endsWith(".ts"));
  let skipped = 0;
  for (const f of files) {
    const src = await readFile(`${dir}/${f}`, "utf8");
    if (src.includes("it.skip(")) skipped++;
  }
  return { generated: files.length, skipped };
}

// Extract WCAG success criteria from a rule's testcases.
function wcagCriteriaFor(cases: ActTestcase[]): string[] {
  const criteria = new Set<string>();
  for (const tc of cases) {
    for (const key of Object.keys(tc.ruleAccessibilityRequirements ?? {})) {
      const m = key.match(/^wcag(20|21|22):(.+)$/);
      if (m) criteria.add(m[2]);
    }
  }
  return [...criteria].sort();
}

const extraById = new Map(extraActRules.map((r) => [r.id, r]));

function ruleDisplayName(ruleId: string): string {
  const cases = testcasesByRule.get(ruleId);
  if (cases && cases.length > 0) return cases[0].ruleName;
  return extraById.get(ruleId)!.name;
}

const allActRuleIds = [...testcasesByRule.keys()].sort((a, b) =>
  ruleDisplayName(a).toLowerCase().localeCompare(ruleDisplayName(b).toLowerCase()),
);

type ActRow = Record<string, string>;

const actRows: ActRow[] = [];
let implementedCount = 0;
let totalApplicableCases = 0;
let totalRunningCases = 0;
for (const ruleId of allActRuleIds) {
  const cases = testcasesByRule.get(ruleId)!;
  const extra = extraById.get(ruleId);
  const ruleName = ruleDisplayName(ruleId);
  const axeIds = [...(actToAxe.get(ruleId) ?? new Set<string>())].sort();
  const directlyImplemented = implementedFiles.has(ruleId);
  const viaAxe = axeIds.some((id) => implementedFiles.has(id));
  const implemented = directlyImplemented || viaAxe;
  if (implemented) implementedCount++;

  const wcag = cases.length > 0 ? wcagCriteriaFor(cases) : extra?.wcag ?? [];
  const applicableCases = cases.filter((c) => c.expected !== "inapplicable").length;
  const { generated, skipped } = await countActTests(ruleId);
  const running = generated - skipped;

  const axeCell =
    axeIds.length === 0
      ? "—"
      : axeIds
          .map((id) =>
            implementedFiles.has(id)
              ? `\`${id}\``
              : `\`${id}\` ❌`,
          )
          .join(", ");

  // Count test coverage only when there's a scanner rule mapped — otherwise
  // generated tests trivially pass without exercising the scanner.
  const exercised = implemented ? running : 0;
  totalApplicableCases += applicableCases;
  totalRunningCases += exercised;

  const testCell = applicableCases === 0
    ? "—"
    : `${exercised} / ${applicableCases}`;

  const nameSuffix = extra?.status === "deprecated" ? " _(deprecated)_" : "";
  actRows.push({
    Implemented: implemented ? "✅" : "❌",
    "ACT Rule": `[${ruleId}](https://act-rules.github.io/rules/${ruleId}) — ${ruleName}${nameSuffix}`,
    WCAG: wcag.length ? wcag.join(", ") : "—",
    "axe-core rule(s)": axeCell,
    "Test cases": testCell,
  });
}

// Build axe-core specific rules (rules without ACT mapping). Preserve existing
// section grouping from rules.json.
function cleanTags(tags: string): string {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && !t.startsWith("cat.") && t !== "review-item")
    .join(", ");
}

function deriveDequeUrl(rule: AxeRule): string {
  return rule.url.replace(/\?.*$/, "");
}

type AxeRow = Record<string, string>;

const axeSections: { name: string; description: string; rows: AxeRow[] }[] = [];

for (const [name, { description, rules }] of Object.entries(rulesJson)) {
  if (name === "Custom Rules (Experimental)") continue;
  const filtered: AxeRow[] = [];
  for (const rule of rules) {
    const hasAct = ACT_LINK_RE.test(String(rule["ACT Rules"] ?? ""));
    ACT_LINK_RE.lastIndex = 0;
    if (hasAct) continue;
    filtered.push({
      Implemented: implementedFiles.has(rule.id) ? "✅" : "❌",
      "axe-core Rule": `[\`${rule.id}\`](${deriveDequeUrl(rule)})`,
      Description: rule.Description,
      Tags: cleanTags(rule.Tags),
      Impact: rule.Impact,
      "Issue Type": rule["Issue Type"],
    });
  }
  if (filtered.length === 0) continue;
  axeSections.push({ name, description, rows: filtered });
}

const customSection = rulesJson["Custom Rules (Experimental)"];
const customRows: AxeRow[] = [];
if (customSection) {
  for (const rule of customSection.rules) {
    customRows.push({
      Implemented: implementedFiles.has(rule.id) ? "✅" : "❌",
      Rule: `[\`${rule.id}\`](${deriveDequeUrl(rule)})`,
      Description: rule.Description,
      Tags: cleanTags(rule.Tags),
      Impact: rule.Impact,
      "Issue Type": rule["Issue Type"],
    });
  }
}

const totalActRules = allActRuleIds.length;
const passRate = totalApplicableCases > 0
  ? Math.round((totalRunningCases / totalApplicableCases) * 100)
  : 0;

const document = `# accessibility-scanner

A TypeScript accessibility scanner aimed at being [W3C ACT (Accessibility Conformance Testing) rules](https://www.w3.org/WAI/standards-guidelines/act/) compatible. Rules from [axe-core](https://github.com/dequelabs/axe-core) that aren't yet codified in ACT are implemented in a separate section.

## ACT Rules

Implementation status against the [ACT Rules Community Group](https://act-rules.github.io/) catalogue. Each rule links to its ACT specification. The **Test cases** column shows how many of the ACT-supplied test cases this scanner runs and passes — out of the total applicable cases for that rule. Test cases that depend on visual rendering, media playback, keyboard interaction, or other capabilities outside the scanner's scope are intentionally not generated.

- **${implementedCount} / ${totalActRules}** ACT rules have a scanner implementation.
- **${totalRunningCases} / ${totalApplicableCases}** ACT test cases (${passRate}%) are exercised against the scanner.

${tablemark(actRows, { headerCase: "preserve" })}

${axeSections
  .map(
    ({ name, description, rows }) =>
      `## Axe-core Specific Rules — ${name}\n\n${
        description ||
        "Rules implemented from the axe-core ruleset that don't have an equivalent in the ACT catalogue."
      }\n\n${tablemark(rows, { headerCase: "preserve" })}`,
  )
  .join("\n\n")}

${
  customRows.length > 0
    ? `## Custom Rules\n\nRules implemented in this scanner that are not part of any external rule set. These are **not included in the default rule set** due to higher false-positive rates. To use them, import and pass them explicitly:\n\n\`\`\`js\nimport { Scanner } from "@koddsson/accessibility-scanner";\nimport errorMessage from "@koddsson/accessibility-scanner/rules/error-message";\n\nconst scanner = new Scanner([...allRules, errorMessage]);\n\`\`\`\n\n${tablemark(customRows, { headerCase: "preserve" })}`
    : ""
}
`.trim() + "\n";

await writeFile("./README.md", document, "utf8");

import { writeFile, readFile, access, constants } from "node:fs/promises";
import { tablemark } from "tablemark";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const ACT_URL = /\((https:\/\/act-rules\.github\.io\/rules\/[a-z0-9]+)\)/;

function deriveUrl(rule: Record<string, unknown>): string {
  const actMatch = String(rule["ACT Rules"] ?? "").match(ACT_URL);
  if (actMatch) return actMatch[1];
  return String(rule.url ?? "");
}

function cleanTags(tags: string): string {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && !t.startsWith("cat.") && t !== "review-item")
    .join(", ");
}

const sections: Record<
  string,
  { description: string; rules: Array<Record<string, unknown>> }
> = JSON.parse(await readFile("./rules.json", "utf8"));
const tables = [];

for (const [name, { description, rules }] of Object.entries(sections)) {
  for (const rule of rules) {
    const implemented = await fileExists(`./src/rules/${rule.id}.ts`);
    rule.implemented = implemented ? "✅" : "❌";
    rule.url = deriveUrl(rule);
    rule.Tags = cleanTags(String(rule.Tags ?? ""));
  }
  const table = tablemark(rules);
  tables.push({
    name,
    description,
    table,
  });
}

const document = `
# accessibility-scanner

${tables
  .map(({ name, description, table }) => {
    return `## ${name}\n\n${description}\n\n${table}\n`;
  })
  .join("\n")}`.trim();

await writeFile("./README.md", document, "utf8");

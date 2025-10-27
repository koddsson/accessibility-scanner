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

const sections: Record<
  string,
  { description: string; rules: Array<Record<string, unknown>> }
> = JSON.parse(await readFile("./rules.json", "utf8"));
const tables = [];

for (const [name, { description, rules }] of Object.entries(sections)) {
  for (const rule of rules) {
    const implemented = await fileExists(`./src/rules/${rule.id}.ts`);
    rule.implemented = implemented ? "✅" : "❌";
  }
  const table = tablemark(rules);
  tables.push({
    name,
    description,
    table,
  });
}

const document = `
# accessbility-scanner

## AXE Rules

${tables
  .map(({ name, description, table }) => {
    return `### ${name}\n\n${description}\n\n${table}\n`;
  })
  .join("\n")}`.trim();

await writeFile("./README.md", document, "utf8");

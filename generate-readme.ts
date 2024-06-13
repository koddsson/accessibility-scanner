import { writeFile, readFile } from "node:fs/promises";
import tablemark from "tablemark";

const sections: Record<
  string,
  { description: string; rules: Array<Record<string, unknown>> }
> = JSON.parse(await readFile("./rules.json", "utf8"));
const tables = [];

for (const [name, { description, rules }] of Object.entries(sections)) {
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

${tables.map(({ name, description, table }) => {
  return `### ${name}\n\n${description}\n\n${table}\n\n`;
})}`.trim();

await writeFile("./README.md", document, "utf8");

import { writeFile, readFile } from "node:fs/promises";
import tablemark from "tablemark";

const rules = JSON.parse(await readFile("./rules.json", "utf8"));

const table = tablemark(rules);

const document = `
# accessbility-scanner

## AXE Rules

### WCAG 2.0 Level A & AA Rules

${table}`.trim();

await writeFile("./README.md", document, "utf8");

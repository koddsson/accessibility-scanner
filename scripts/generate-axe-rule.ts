import { writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import * as cheerio from "cheerio";
import { format } from "prettier";

const args = parseArgs({
  options: {
    rule: {
      type: "string",
    },
  },
});

const {
  values: { rule },
} = args;

const response = await fetch(
  `https://dequeuniversity.com/rules/axe/4.4/${rule}`,
);

if (!response.ok) {
  throw new Error("Couldn't find rule");
}

const $ = cheerio.load(await response.text());

const text = $("h1").text();
const good = $(".example:has(h3.good) > pre > code").text().split("\n\n");
const bad = $(".example:has(h3.bad) > pre > code").text().split("\n\n");

const ruleTemplate = await format(
  `import { AccessibilityError } from "../scanner";

const text = "${text}";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/${rule}";

export default function (el: Element): AccessibilityError[] {
  throw new Error('Not implemented');

  const errors = [];
  return errors;
}`,
  { parser: "typescript" },
);

const testTemplate = await format(
  `import { fixture, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import rule from "../src/rules/${rule}";

const scanner = new Scanner([rule]);

const passes = [
  ${good.map((t) => `\`${t}\`,`).join("\n")}
];

const violations = [
  ${bad.map((t) => `\`${t}\`,`).join("\n")}
];

describe("${rule}", async function () {
  for (const markup of passes) {
    const el = await fixture(markup);
    it(el.outerHTML, async function () {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const markup of violations) {
    const el = await fixture(markup);
    it(el.outerHTML, async function () {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          "text": "${text}",
          "url": "https://dequeuniversity.com/rules/axe/4.4/${rule}"
        },
      ]);
    });
  }
});`,
  { parser: "typescript" },
);

await writeFile(`./src/rules/${rule}.ts`, ruleTemplate, "utf8");
await writeFile(`./tests/${rule}.ts`, testTemplate, "utf8");

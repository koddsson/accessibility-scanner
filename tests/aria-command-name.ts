import { fixture, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import rule from "../src/rules/aria-command-name";

const scanner = new Scanner([rule]);

const passes = [
  `<div role="link" id="al" aria-label="Name"></div>`,
  `<div>
  <div id="labeldiv">Name</div>
  <div role="button" id="alb" aria-labelledby="labeldiv"></div>
  </div>`,
  `<div role="menuitem" id="combo" aria-label="Aria Name">Name</div>`,
  `<div role="link" id="title" title="Title"></div>
`,
];

const violations = [
  `<div role="link" id="empty"></div>`,
  `<div role="button" id="alempty" aria-label=""></div>`,
  `<div role="menuitem" id="albmissing" aria-labelledby="nonexistent"></div>`,
  `<div><div role="link" id="albempty" aria-labelledby="emptydiv"></div>
<div id="emptydiv"></div></div>`,
];

describe("aria-command-name", async function () {
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
          text: "ARIA button, link, and menuitem must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/aria-command-name",
        },
      ]);
    });
  }
});

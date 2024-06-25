import { fixture, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import { ariaDialogName } from "../src/rules/aria-dialog-name";

const scanner = new Scanner([ariaDialogName]);

const passes = [
  `<div>
    <div role="dialog" id="alb" aria-labelledby="labeldiv"></div>
    <div id="labeldiv">My dialog!</div>
  </div>`,
  `<div role="alertdialog" id="combo" aria-label="Aria Name">Name</div>`,
  `<div role="dialog" id="title" title="Title"></div>`,
];

const violations = [
  `<div role="dialog" id="empty"></div>`,
  `<div role="alertdialog" id="alempty" aria-label=""></div>`,
  `<div role="dialog" id="albmissing" aria-labelledby="nonexistent"></div>`,
  `<div>
    <div role="dialog" id="albempty" aria-labelledby="emptydiv"></div>
    <div id="emptydiv"></div>
  </div>`,
];

describe("aria-dialog-name", async function () {
  for (const markup of passes) {
    const el = await fixture(markup);
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for await (const markup of violations) {
    const el = await fixture(markup);
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "ARIA tooltip must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
        },
      ]);
    });
  }
});

import { fixture, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner.js";
import { ariaRequiredAttr } from "../src/rules/aria-required-attr.js";

const scanner = new Scanner([ariaRequiredAttr]);

async function fixtures(markups: string[]): Promise<Element[]> {
  const elements = [];
  for (const markup of markups) {
    elements.push(await fixture(markup));
  }
  return elements;
}

const passes = await fixtures([
  '<div id="target" role="switch" tabindex="1" aria-checked="false"></div>',
  '<div id="target"></div>',
  '<input id="target" type="range" role="slider">',
  '<input id="target" type="checkbox" role="switch">',
  '<h2 id="target" role="heading">Title</h2>',
  '<div id="target" role="heading" aria-level="2">Title</div>',
  '<div id="target" role="separator"></div>',
  '<div id="target" role="separator" tabindex="0" aria-valuenow="50"></div>',
  '<div id="target" role="combobox" aria-expanded="false"></div>',
  '<div id="target" role="combobox" aria-expanded="true" aria-controls="test"></div>',
  '<div id="target" role="scrollbar" aria-controls="test" aria-valuenow="50"></div>',
]);

const violations = await fixtures([
  '<div id="target" role="switch" tabindex="1"></div>',
  '<div id="target" role="switch" tabindex="1" aria-checked></div>',
  '<div id="target" role="switch" tabindex="1" aria-checked=""></div>',
  '<div id="target" role="checkbox"></div>',
  '<div id="target" role="slider"></div>',
  '<div id="target" role="heading">Title</div>',
  '<div id="target" role="separator" tabindex="0"></div>',
  '<div id="target" role="scrollbar" aria-valuenow="50"></div>',
  '<div id="target" role="combobox" aria-expanded="invalid-value"></div>',
  '<div id="target" role="combobox" aria-expanded="true" aria-owns="ownedchild"></div>',
  '<div id="target" role="combobox"></div>',
  '<div id="target" role="combobox" aria-expanded="true"></div>',
]);

describe("aria-required-attr", function () {
  for (const el of passes) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const el of violations) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Required ARIA attributes must be provided",
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-required-attr",
        },
      ]);
    });
  }
});

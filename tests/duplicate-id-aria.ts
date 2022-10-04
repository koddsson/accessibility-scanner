import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import duplicateIdAria from "../src/rules/duplicate-id-aria";

const scanner = new Scanner([duplicateIdAria]);

const passes = [
  await fixture(html`<div id="foo"></div>'`),
  await fixture(html`<div id="foo"></div><span id="foo"></span>'`),
  await fixture(html`<button id="foo"></button>'`),
  await fixture(html`<div id="foo"></div><button id="foo"></button>'`)
];

const violations = [
  await fixture(html`<div><div id="foo"></div><div aria-labelledby="foo"></div></div>`),
  await fixture(html`<div><button id="foo"></button><div aria-labelledby="foo"></div><span id="foo"></span></div>`),
  await fixture(html`<div><button id="foo"></button><div aria-labelledby="foo"></div></div>`),
  await fixture(html`<div><div id="foo"></div><div aria-labelledby="foo"></div><span id="foo"></span></div>`)
];

describe("input-button-name", async function () {
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
          "text": "IDs used in ARIA and labels must be unique",
          "url": "https://dequeuniversity.com/rules/axe/4.4/duplicate-id-aria"
        },
      ]);
    });
  }
});

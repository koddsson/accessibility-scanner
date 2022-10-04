import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import inputButtonName from "../src/rules/input-button-name";

const scanner = new Scanner([inputButtonName]);

const passes = [
  await fixture(html`<input type="button" id="pass1" value="Button Name" />`),
  await fixture(html`<input type="button" id="pass2" aria-label="Name" />`),
  await fixture(html`<div id="labeldiv">Test</div><input type="button" id="pass3" aria-labelledby="labeldiv" />`),
  await fixture(html`<input type="button" id="pass4" value="Name" aria-label="Aria Name" />`),
  await fixture(html`<input type="submit" id="pass5" />`),
  await fixture(html`<input type="submit" value="Something" id="pass6" />`),
  await fixture(html`<input type="reset" id="pass7" />`),
  await fixture(html`<input type="reset" value="Something" id="pass8" />`),
  await fixture(html`<input type="button" title="Something" id="pass9" />`),
  await fixture(html`<input type="submit" title="Something" id="pass10" />`),
  await fixture(html`<input type="reset" title="Something" id="pass11" />`),
];

const violations = [
    await fixture(html`<input type="button" id="fail1" />`),
    await fixture(html`<input type="button" id="fail2" aria-label="" />`),
    await fixture(html`<input type="button" id="fail3" aria-labelledby="nonexistent" />`),
    await fixture(html`<input type="button" id="fail4" aria-labelledby="emptydiv" /><div id="labeldiv">Button label</div><div id="emptydiv"></div>`),
    await fixture(html`<input type="submit" value="" id="fail5" />`),
    await fixture(html`<input type="reset" value="" id="fail6" />`)
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

      if (!results.length) console.log(el.outerHTML)
      expect(results).to.eql([
        {
           text: 'Input buttons must have discernible text',
           url: 'https://dequeuniversity.com/rules/axe/4.4/input-button-name'
        },
      ]);
    });
  }
});

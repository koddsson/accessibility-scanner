import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import nestedInteractive from "../src/rules/nested-interactive";

const scanner = new Scanner([nestedInteractive]);

const passes = [
  await fixture(html`<button id="pass1">pass</button>`),
  await fixture(
    html`<button id="pass2"><span tabindex="-1">pass</span></button>`,
  ),
  await fixture(html`<div role="button" id="pass3">pass</div>`),
  await fixture(html`<div role="tab" id="pass4">pass</div>`),
  await fixture(html`<div role="checkbox" id="pass5">pass</div>`),
  await fixture(html`<div role="radio" id="pass6"><span>pass</span></div>`),
  await fixture(
    html`<div role="radio" id="pass7"><span tabindex="-1">pass</span></div>`,
  ),
  await fixture(
    html`<button id="pass8"><span tabindex="0">pass</span></button>`,
  ),
  await fixture(
    html`<div role="radio" id="pass10"><span tabindex="0">pass</span></div>`,
  ),
];

const violations = [
  await fixture(html`<div role="button" id="fail1"><input /></div>`),
  await fixture(html`
    <div role="tab" id="fail2">
      <button id="pass9">div fails, button passes</button>
    </div>
  `),

  await fixture(
    html`<div role="checkbox" id="fail3"><a href="foo.html">fail</a></div>`,
  ),
  await fixture(
    html`<div role="radio" id="fail4">
      <button id="pass11" tabindex="-1">not really hidden</button>
    </div>`,
  ),
  await fixture(
    html`<div role="radio" id="fail5">
      <button aria-hidden="true" tabindex="-1">not really hidden</button>
    </div>`,
  ),

  // Ignored
  // await fixture(html`<a id="ignored1" href="foo.html">ignored</a>`),
  // await fixture(html`<span id="ignored2">ignored</span>`),
];

describe.only("nested-interactive", async function () {
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
          text: "Interactive controls must not be nested",
          url: "https://dequeuniversity.com/rules/axe/4.4/nested-interactive",
        },
      ]);
    });
  }
});

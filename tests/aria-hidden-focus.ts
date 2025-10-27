import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaHiddenFocus from "../src/rules/aria-hidden-focus";

const scanner = new Scanner([ariaHiddenFocus]);

const passes = [
  await fixture(html`<p id="pass1" aria-hidden="true">Some text</p>`),
  await fixture(html`<div id="pass2" aria-hidden="true"><a href="/" style="display: none">Link</a></div>`),

  await fixture(html`<div id="pass3" aria-hidden="true"> <button tabindex="-1">Some button</button></div>`),

  await fixture(html`<div id="pass4" aria-hidden="true"> <input id="pass4" disabled aria-hidden="true" />
</div>`),

  await fixture(html`<div id="pass5" aria-hidden="true">
  <!-- aria-hidden=false does not negate aria-hidden true -->
  <div aria-hidden="false">
    <button tabindex="-1">Some button</button>
  </div>
</div>`),

  await fixture(html`<div id="pass6" aria-hidden="true">
  <label>
    Enter your comments:
    <textarea tabindex="-1"></textarea>
  </label>
</div>`),

  await fixture(html`<div id="pass7" aria-hidden="true">
  <div inert>
    <button>hello</button>
  </div>
</div>`),
];


const violations = [
  await fixture(html`<div id="violation1" aria-hidden="true">
    <a href="/" style="position: absolute; top: -999em">Link</a>
  </div>`),

  await fixture(html`<div id="violation2" aria-hidden="true">
    <input aria-disabled="true" />
  </div>`),

  await fixture(html`<p id="violation3" tabindex="0" aria-hidden="true">Some text</p>`),

  await fixture(html`<details id="violation4" aria-hidden="true">
    <summary>Some button</summary>
    <p>Some details</p>
  </details>`),

  await fixture(html`<div id="violation5" aria-hidden="true">
    <label>
      Choose:
      <select>
        <option selected="selected">Chosen</option>
        <option>Not Selected</option>
      </select>
    </label>
  </div>`),

await fixture(html`<main id="violation6" aria-hidden="true">
  <map name="infographic">
    <area
      shape="rect"
      coords="184,6,253,27"
      href="https://mozilla.org"
      target="_blank"
      alt="Mozilla"
    />
  </map>
</main>`),

await fixture(html`<div id="violation7" aria-hidden="true">
  <a href="">foo</a><button>bar</button>
</div>`),
];

describe("aria-hidden-focus", async function () {
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
      "text": "aria-hidden elements do not contain focusable elements",
      "url": "https://dequeuniversity.com/rules/axe/4.4/aria-hidden-focus"
        },
      ]);
    });
  }
});

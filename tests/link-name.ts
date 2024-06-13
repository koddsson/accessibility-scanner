import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import linkName from "../src/rules/link-name";

const scanner = new Scanner([linkName]);

const passes = [
  await fixture(html`<input type="image" alt="monkeys" />`),
  await fixture(html`<input type="image" aria-label="monkeys" />`),
  await fixture(html`<input type="image" alt="" />`),
  await fixture(html`<input type="image" title="monkey" />`),

  await fixture(html`<a href="#" id="pass1">This link has text</a>`),
  await fixture(html`<a href="#" id="pass2" aria-label="link text"></a>`),
  await fixture(
    html`<div id="linklabel">Text</div>
      <a href="#" id="pass3" aria-labelledby="linklabel"></a>`,
  ),
  await fixture(html`<a href="#" id="pass4" title="title text"></a>`),
  await fixture(
    html`<a href="#" id="pass5">
      <article>Some sectioning content</article>
    </a>`,
  ),
];

const violations = [
  await fixture(html`<a href="#" id="violation1"></a>`),
  await fixture(
    html`<a href="#" id="violation2" aria-labelledby="nonexistent"></a>`,
  ),
  await fixture(
    html`<div>
      <div id="empty-label"></div>
      <a href="#" id="violation3" aria-labelledby="empty-label"></a>
    </div>`,
  ),
  await fixture(html`<a href="#" id="violation4" role="none"></a>`),
  await fixture(html`<a href="#" id="violation5" role="presentation"></a>`),

  // await fixture(html`<span id="inapplicable1" role="link">Does not apply</span>`),
];

describe("link-has-non-empty-accessible-name", async function () {
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
          text: "Link has non-empty accessible name",
          url: "https://act-rules.github.io/rules/c487ae",
        },
      ]);
    });
  }
});

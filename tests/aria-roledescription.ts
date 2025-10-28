import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaRoledescription from "../src/rules/aria-roledescription";

const scanner = new Scanner([ariaRoledescription]);

const passes = [
  // Elements with explicit roles
  await fixture(
    html`<div role="button" aria-roledescription="custom button">Click me</div>`,
  ),
  await fixture(
    html`<div role="region" aria-roledescription="custom region">Content</div>`,
  ),
  await fixture(
    html`<span role="img" aria-roledescription="icon">🎉</span>`,
  ),

  // Elements with implicit roles based on HTML semantics
  await fixture(html`<button aria-roledescription="custom button">Click me</button>`),
  await fixture(html`<a href="#" aria-roledescription="custom link">Link</a>`),
  await fixture(html`<img src="test.jpg" alt="test" aria-roledescription="custom image" />`),
  await fixture(
    html`<nav aria-roledescription="custom navigation">
      <ul>
        <li><a href="#">Link</a></li>
      </ul>
    </nav>`,
  ),
  await fixture(html`<main aria-roledescription="custom main">Content</main>`),
  await fixture(html`<article aria-roledescription="custom article">Article content</article>`),
  await fixture(html`<aside aria-roledescription="custom sidebar">Sidebar</aside>`),
  await fixture(html`<h1 aria-roledescription="custom heading">Title</h1>`),
  await fixture(html`<input type="text" aria-roledescription="custom textbox" />`),
  await fixture(html`<input type="checkbox" aria-roledescription="custom checkbox" />`),
  await fixture(html`<select aria-roledescription="custom select"><option>Option</option></select>`),
  await fixture(html`<textarea aria-roledescription="custom textarea"></textarea>`),
  await fixture(html`<table aria-roledescription="custom table"><tr><td>Cell</td></tr></table>`),

  // Elements without aria-roledescription (should pass)
  await fixture(html`<div>Plain div without aria-roledescription</div>`),
  await fixture(html`<span>Plain span</span>`),

  // Empty or whitespace-only aria-roledescription (should pass/be ignored)
  await fixture(html`<div aria-roledescription="">Empty roledescription</div>`),
  await fixture(html`<div aria-roledescription="   ">Whitespace roledescription</div>`),
];

const violations = [
  // Elements with aria-roledescription but no explicit or implicit role
  await fixture(
    html`<div aria-roledescription="custom element">No role</div>`,
  ),
  await fixture(
    html`<span aria-roledescription="custom element">No role</span>`,
  ),
  await fixture(
    html`<p aria-roledescription="custom element">Paragraph with no explicit role</p>`,
  ),

  // input with type="hidden" has no implicit role
  await fixture(
    html`<input type="hidden" aria-roledescription="custom hidden" />`,
  ),

  // Elements with empty/whitespace role attribute should be treated as no role
  await fixture(
    html`<div role="" aria-roledescription="custom">Empty role</div>`,
  ),
  await fixture(
    html`<div role="   " aria-roledescription="custom">Whitespace role</div>`,
  ),

  // section without aria-label/aria-labelledby has no implicit role
  await fixture(
    html`<section aria-roledescription="custom">No label</section>`,
  ),

  // a/area without href have no implicit role
  await fixture(
    html`<a aria-roledescription="custom link">No href</a>`,
  ),
];

// Special test case: nested elements with violations
const nestedViolations = [
  // Both div and span lack roles, so we expect 2 violations
  await fixture(
    html`<div aria-roledescription="slide">
      <span aria-roledescription="no role">Content</span>
    </div>`,
  ),
];

describe("aria-roledescription", async function () {
  for (const el of passes) {
    it(`PASS: ${el.outerHTML}`, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const el of violations) {
    it(`FAIL: ${el.outerHTML}`, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure aria-roledescription is only used on elements with an implicit or explicit role",
          url: "https://dequeuniversity.com/rules/axe/4.4/aria-roledescription",
        },
      ]);
    });
  }

  for (const el of nestedViolations) {
    it(`FAIL (multiple): ${el.outerHTML}`, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      // Both the div and span have violations
      expect(results).to.eql([
        {
          text: "Ensure aria-roledescription is only used on elements with an implicit or explicit role",
          url: "https://dequeuniversity.com/rules/axe/4.4/aria-roledescription",
        },
        {
          text: "Ensure aria-roledescription is only used on elements with an implicit or explicit role",
          url: "https://dequeuniversity.com/rules/axe/4.4/aria-roledescription",
        },
      ]);
    });
  }
});

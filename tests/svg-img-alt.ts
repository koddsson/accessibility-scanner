import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import svgImgAlt from "../src/rules/svg-img-alt";

const scanner = new Scanner([svgImgAlt]);
const parser = new DOMParser();

// Test cases that should pass (no errors)
const passes = [
  `<svg role="img" aria-label="Alternative text"></svg>`,
  `<svg role="img" title="Alternative text"></svg>`,
  `<div><div id="label">Alternative text</div><svg role="img" aria-labelledby="label"></svg></div>`,
  `<svg role="graphics-document" aria-label="Alternative text"></svg>`,
  `<svg role="graphics-symbol" aria-label="Alternative text"></svg>`,
  `<svg role="graphics-document" title="Alternative text"></svg>`,
  `<svg role="graphics-symbol" title="Alternative text"></svg>`,
  `<div><div id="label2">Alternative text</div><svg role="graphics-document" aria-labelledby="label2"></svg></div>`,
  `<div><div id="label3">Alternative text</div><svg role="graphics-symbol" aria-labelledby="label3"></svg></div>`,
];

// Test cases that should fail (violations)
const violations = [
  await fixture(html`<svg role="img"></svg>`),
  await fixture(html`<svg role="img" aria-label=""></svg>`),
  await fixture(html`<svg role="img" title=""></svg>`),
  await fixture(html`<svg role="img" aria-labelledby="no-match"></svg>`),
  await fixture(html`<svg role="graphics-document"></svg>`),
  await fixture(html`<svg role="graphics-document" aria-label=""></svg>`),
  await fixture(html`<svg role="graphics-symbol"></svg>`),
  await fixture(html`<svg role="graphics-symbol" title=""></svg>`),
];

describe("svg-img-alt", async function () {
  for (const htmlString of passes) {
    it(`should pass: ${htmlString}`, async () => {
      const doc = parser.parseFromString(htmlString, "text/html");
      const results = await scanner.scan(doc.body);
      expect(results).to.be.empty;
    });
  }

  for (const el of violations) {
    it(`should fail: ${el.outerHTML}`, async () => {
      const errors = await scanner.scan(el);
      const results = errors.map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <svg> elements with an img, graphics-document or graphics-symbol role have an accessible text",
          url: "https://dequeuniversity.com/rules/axe/4.4/svg-img-alt",
        },
      ]);
    });
  }

  it("should not flag svg without explicit role", async () => {
    const el = await fixture(html`<svg></svg>`);
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });

  it("should not flag svg with other roles", async () => {
    const el = await fixture(html`<svg role="presentation"></svg>`);
    const results = await scanner.scan(el);
    expect(results).to.be.empty;
  });
});

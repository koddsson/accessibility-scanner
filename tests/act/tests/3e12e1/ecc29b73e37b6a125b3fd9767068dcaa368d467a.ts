import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[3e12e1]Block of repeated content is collapsible", function () {
  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/3e12e1/ecc29b73e37b6a125b3fd9767068dcaa368d467a.svg)", async () => {
    const document = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">
  <title>This is an SVG</title>
</svg>`, 'image/svg+xml');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/bypass"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

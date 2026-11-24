import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[b5c3f8]HTML page has lang attribute", function () {
  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b5c3f8/b584aa8aeb33814a0ecb63fd9ed4d97f2211f837.svg)", async () => {
    const document = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" lang="en">
    <text>
        The quick brown fox jumps over the lazy dog.
    </text>
</svg>`, 'image/svg+xml');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-has-lang"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

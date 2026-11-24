import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[b5c3f8]HTML page has lang attribute", function () {
  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b5c3f8/58847c387d3b2cfa7e57c6ed613a8f31569cfd30.xml)", async () => {
    const document = parser.parseFromString(`<math lang="en">
    The quick brown fox jumps over the lazy dog.
</math>`, 'application/xml');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-has-lang"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

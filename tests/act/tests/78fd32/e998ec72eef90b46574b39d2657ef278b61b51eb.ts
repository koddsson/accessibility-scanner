import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[78fd32]Important line height in style attributes is wide enough", function () {
  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/e998ec72eef90b46574b39d2657ef278b61b51eb.svg)", async () => {
    const document = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">
    <text y="20" style="line-height: 1.2em">ACT rules</text>
</svg>`, 'image/svg+xml');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/avoid-inline-spacing"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

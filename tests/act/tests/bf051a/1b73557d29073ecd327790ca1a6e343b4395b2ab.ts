import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bf051a]HTML page `lang` attribute has valid language tag", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bf051a/1b73557d29073ecd327790ca1a6e343b4395b2ab.svg)", async () => {
    const document = await render(`<svg xmlns="http://www.w3.org/2000/svg" lang="fr"></svg>`, 'image/svg+xml');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-lang-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

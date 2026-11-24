import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[2779a5]HTML page has non-empty title", function () {
  afterEach(cleanup);

  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/820fb18c9bb20fb1a940a0806a87c6f6e468bb5b.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<h1>this page has no title</h1>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[2779a5]HTML page has non-empty title", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/314d991fa5328e41f8a806bfbac84d748b41f7ed.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<title></title>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

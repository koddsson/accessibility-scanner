import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[2779a5]HTML page has non-empty title", function () {
  afterEach(cleanup);

  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/4eeff9c95f15e90ca5abc972079112d1ea5c3d51.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<title> </title>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

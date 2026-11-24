import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/c1cc2a71e88c5fec2bc41175d63339404747bf00.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<iframe title="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </iframe>

	<iframe title="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html"> </iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

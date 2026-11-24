import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Inapplicable Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/f686e5e01a34866c49dabed05e5a840873c3c708.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<object title="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </object>

	<object aria-label="List of Contributors Clone" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html"> </object>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

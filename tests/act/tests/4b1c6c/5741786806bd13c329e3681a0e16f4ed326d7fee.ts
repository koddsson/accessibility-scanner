import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/5741786806bd13c329e3681a0e16f4ed326d7fee.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<iframe title="Contact us" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/sub-dir-2/"> </iframe>

	<iframe title="Contact us" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/sub-dir-2"> </iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

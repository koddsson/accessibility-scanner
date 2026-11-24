import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/f8d3c1afa946cf4fc97ef799aad6d9d090de6e8f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<div id="desc-for-title">List of Contributors</div>
	<iframe aria-labelledby="desc-for-title" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </iframe>

	<div id="desc-for-title1">List of Contributors</div>
	<iframe aria-labelledby="desc-for-title1" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

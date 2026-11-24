import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/ac65ce86f38bce79d12b797567bb8d85875aab88.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<iframe aria-label="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </iframe>

	<iframe aria-label="List of Contributors" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html"> </iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Inapplicable Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/8f35b76114d0dd59fcd78d46c7af113838cc99ea.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<iframe src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html"> </iframe>

	<iframe src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html"> </iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

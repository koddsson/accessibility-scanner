import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4b1c6c]Iframe elements with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Inapplicable Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/ab3046bbe77ef23bb7b5ce9f79f53230e0a6a7d0.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<iframe style="display:none;" title="Document One" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-one.html">
	</iframe>

	<iframe style="display:none;" aria-label="Document One" src="/WAI/content-assets/wcag-act-rules/test-assets/iframe-unique-name-4b1c6c/page-two.html">
	</iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-title-unique"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

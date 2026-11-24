import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/547d69dca1d88658ee7036136b8cd29e05a28823.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<a>Link text</a>
	<area aria-label="Link text" />
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

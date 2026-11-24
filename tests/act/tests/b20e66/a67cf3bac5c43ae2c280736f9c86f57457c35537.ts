import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  afterEach(cleanup);

  it("Failed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/a67cf3bac5c43ae2c280736f9c86f57457c35537.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<a href="/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/index.html">Contact us</a>
	<a href="/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/redirect1.html">Contact us</a>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

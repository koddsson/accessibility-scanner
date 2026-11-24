import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[59796f]Image button has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/59796f/04342a3834e0003f3057807937d617e432e83d33.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<input type="image" name="search" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/search-icon.svg" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/input-image-alt"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

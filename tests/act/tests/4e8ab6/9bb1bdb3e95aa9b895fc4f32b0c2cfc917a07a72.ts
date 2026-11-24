import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  afterEach(cleanup);

  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/9bb1bdb3e95aa9b895fc4f32b0c2cfc917a07a72.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<div role="checkbox" aria-labelledby="label"></div>
	<div id="label">Check me</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-attr"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

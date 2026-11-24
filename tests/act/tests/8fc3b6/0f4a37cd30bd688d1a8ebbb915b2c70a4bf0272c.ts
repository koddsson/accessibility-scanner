import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[8fc3b6]Object element rendering non-text content has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/8fc3b6/0f4a37cd30bd688d1a8ebbb915b2c70a4bf0272c.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<span id="label"></span> <object aria-labelledby="label" data="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png"></object>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/object-alt"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

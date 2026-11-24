import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[307n5z]Element with presentational children has no focusable content", function () {
  afterEach(cleanup);

  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/e687f56e16c718c737b2ebc096ab768bd9d87d50.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 2</title>
</head>
<body>
	<a href="https://w3.org"><span tabindex="0">W3C Website</span></a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/nested-interactive"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[0ssw9k]Scrollable content can be reached with sequential focus navigation", function () {
  afterEach(cleanup);

  it("Inapplicable Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/0ssw9k/dd5ca5252dacc6d5e0fabb30e92633b284336832.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 6</title>
</head>
<body>
	<iframe src="https://www.w3.org/TR/WCAG21/#abstract" width="500" height="200"></iframe>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/scrollable-region-focusable"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

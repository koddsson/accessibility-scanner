import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[ff89c9]ARIA required context role", function () {
  afterEach(cleanup);

  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/7ec257f7f32bbe21231743ef1da46943584142c8.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 2</title>
</head>
<body>
	<ul>
		<li>List item 1</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-parent"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

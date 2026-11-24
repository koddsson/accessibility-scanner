import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[ff89c9]ARIA required context role", function () {
  afterEach(cleanup);

  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/44afe364fc9417fd5663599145f670552f507ab0.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<ul>
		<div role="listitem">List item 1</div>
		<div role="listitem">List item 2</div>
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

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[ff89c9]ARIA required context role", function () {
  afterEach(cleanup);

  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/2ffe7d6cfa547dc8b107922a6bd7542ea36c96d6.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
	<div role="list" aria-owns="item1 item2">
		<div role="listitem">
			<div id="item1" role="listitem">List item 1</div>
			<div id="item2" role="listitem">List item 2</div>
		</div>
	</div>
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

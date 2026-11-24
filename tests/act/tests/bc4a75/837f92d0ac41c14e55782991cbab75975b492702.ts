import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bc4a75]ARIA required owned elements", function () {
  afterEach(cleanup);

  it("Inapplicable Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/837f92d0ac41c14e55782991cbab75975b492702.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 4</title>
</head>
<body>
	<ul role="menu" aria-busy="true">
		Loading
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-children"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bc4a75]ARIA required owned elements", function () {
  afterEach(cleanup);

  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/9b8254ecd2ab2ecca6bdc6e050f87f0f42f16c38.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<div role="menu">
		<div role="none"></div>
		<div role="menuitem">Item 1</div>
		<div role="menuitemradio" aria-checked="false">Item 2</div>
		<div role="menuitemcheckbox" aria-checked="false">Item 3</div>
	</div>
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

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[bc4a75]ARIA required owned elements", function () {
  afterEach(cleanup);

  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/51307c16b15d283b9f6ba7e4edc1bb99449f3f37.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<div role="menu">
		<div role="group">
			<span role="menuitem">Item 1</span>
			<div role="group">
				<span role="menuitem">Item 2</span>
				<span role="menuitem">Item 3</span>
			</div>
		</div>
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

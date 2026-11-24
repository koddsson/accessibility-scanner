import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[6cfa84]Element with aria-hidden has no content in sequential focus navigation", function () {
  afterEach(cleanup);

  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6cfa84/4d71a1ad253efab083f05dc558656d94eb430ca7.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<div aria-hidden="yes">
		<p>Some text</p>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-hidden-focus"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

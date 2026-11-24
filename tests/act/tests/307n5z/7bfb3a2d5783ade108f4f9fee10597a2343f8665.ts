import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[307n5z]Element with presentational children has no focusable content", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/7bfb3a2d5783ade108f4f9fee10597a2343f8665.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<ul role="tablist">
		<li role="tab">
			<a href="#">Tab 1</a>
		</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/nested-interactive"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

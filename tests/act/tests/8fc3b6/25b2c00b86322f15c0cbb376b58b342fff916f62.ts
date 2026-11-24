import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[8fc3b6]Object element rendering non-text content has non-empty accessible name", function () {
  it.skip("Inapplicable Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/8fc3b6/25b2c00b86322f15c0cbb376b58b342fff916f62.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 8</title>
</head>
<body>
	<object data="/invalid/url/index.html">
		<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="W3C logo" />
	</object>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/object-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

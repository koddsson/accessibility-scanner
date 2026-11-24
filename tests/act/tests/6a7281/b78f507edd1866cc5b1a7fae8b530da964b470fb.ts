import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[6a7281]ARIA state or property has valid value", function () {
  it("Failed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/b78f507edd1866cc5b1a7fae8b530da964b470fb.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 7</title>
</head>
<body>
	<div role="alert" aria-relevant="text always"></div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-valid-attr-value"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

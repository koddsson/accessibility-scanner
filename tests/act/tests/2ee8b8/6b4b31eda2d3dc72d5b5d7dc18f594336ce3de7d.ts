import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Passed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/6b4b31eda2d3dc72d5b5d7dc18f594336ce3de7d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 10</title>
</head>
<body>
	<a aria-label="Download specification" href="#"
		>Download <span style="visibility: hidden">the</span> <span style="display: none">gizmo</span> specification</a
	>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

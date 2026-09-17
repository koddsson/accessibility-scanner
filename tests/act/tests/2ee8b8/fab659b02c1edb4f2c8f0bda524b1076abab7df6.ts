import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Passed Example 11 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/fab659b02c1edb4f2c8f0bda524b1076abab7df6.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 11</title>
</head>
<body>
	<a aria-label="Download specification" href="#"
		><span>Download</span><span id="space"> </span><span>specification</span></a
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

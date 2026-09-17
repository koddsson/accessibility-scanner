import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Failed Example 14 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/dd8d7419bca332d96b15ca14b9ba46e5233ab676.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 14</title>
</head>
<body>
	<a aria-label="two zero two three" href="#">2 0 2 3</a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

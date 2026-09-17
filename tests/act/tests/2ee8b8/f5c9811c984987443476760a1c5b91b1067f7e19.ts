import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Failed Example 15 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/f5c9811c984987443476760a1c5b91b1067f7e19.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 15</title>
</head>
<body>
	<a aria-label="1a" href="#">1</a>
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

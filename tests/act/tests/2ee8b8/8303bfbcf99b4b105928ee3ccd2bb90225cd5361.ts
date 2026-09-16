import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Failed Example 12 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/8303bfbcf99b4b105928ee3ccd2bb90225cd5361.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 12</title>
</head>
<body>
	<a href="#" aria-label="fibonacci: 0 1 1 2 3 5 8 13 21 34">fibonacci: 0112358132134</a>
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

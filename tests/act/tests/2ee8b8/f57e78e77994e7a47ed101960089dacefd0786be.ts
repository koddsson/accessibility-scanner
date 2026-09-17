import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it("Failed Example 13 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/f57e78e77994e7a47ed101960089dacefd0786be.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 13</title>
</head>
<body>
	<a href="#2021" aria-label="twenty twenty-one">two thousand twenty-one</a>
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

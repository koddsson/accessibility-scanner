import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  it("Failed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/130d7f761a6a43b896b2f1d0ded311da6a7aebf1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 8</title>
</head>
<body>
	<label>Email<input autocomplete="work"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

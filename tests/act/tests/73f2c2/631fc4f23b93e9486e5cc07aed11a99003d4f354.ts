import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  it("Inapplicable Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/631fc4f23b93e9486e5cc07aed11a99003d4f354.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 9</title>
</head>
<body>
	<input type="hidden" autocomplete="transaction-amount" value="100.00">
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

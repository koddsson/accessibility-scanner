import { expect } from "@open-wc/testing";
import { scan, allRules } from "../../../../src/scanner.js";
import errorMessage from "../../../../src/rules/error-message.js";

const parser = new DOMParser();

describe("[36b590]Error message describes invalid form field value", function () {
  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/36b590/ac63f6ffcb1831a5614e525627822e7a6f15343d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 1</title>
</head>
<body>
	<p>This is a paragraph.</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body, [...allRules, errorMessage])).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://act-rules.github.io/rules/36b590"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

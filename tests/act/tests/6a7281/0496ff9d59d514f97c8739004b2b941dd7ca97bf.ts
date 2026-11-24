import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[6a7281]ARIA state or property has valid value", function () {
  it("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/0496ff9d59d514f97c8739004b2b941dd7ca97bf.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 9</title>
</head>
<body>
	<a href="/" aria-current="page">Home</a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-valid-attr-value"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[6a7281]ARIA state or property has valid value", function () {
  it("Passed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/ed053b32aa2b4453ddc225e45f7f1931f62c7f49.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 10</title>
</head>
<body>
	<div role="alert" aria-relevant="text removals"></div>
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

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[bc659a]Meta element has no refresh delay", function () {
  it("Inapplicable Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/8ce8198a1e6907ae25eb957eb0a5a99e719131a1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="foo; URL='https://w3.org'" />
</head>
<body>
	<p>This page does not redirect.</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-refresh"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[674b10]Role attribute has valid value", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/9980fd3a6f30b20069618708b2c8fa79d444e0a4.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<style>
		.ref {
			color: #0000ee;
			text-decoration: underline;
			cursor: pointer;
		}
	</style>
	See [<span class="ref" onclick="location.href='https://act-rules.github.io/'" role="doc-biblioref link">ACT rules</span
	>].
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-roles"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

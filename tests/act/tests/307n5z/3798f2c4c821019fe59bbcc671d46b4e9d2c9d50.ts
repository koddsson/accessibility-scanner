import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[307n5z]Element with presentational children has no focusable content", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/3798f2c4c821019fe59bbcc671d46b4e9d2c9d50.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<button>
		Save
		<span role="button" aria-label="save options" aria-expanded="false" tabindex="0">▼</span>
	</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/nested-interactive"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

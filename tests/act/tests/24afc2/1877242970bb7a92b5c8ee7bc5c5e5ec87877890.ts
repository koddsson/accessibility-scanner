import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[24afc2]Important letter spacing in style attributes is wide enough", function () {
  it("Inapplicable Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/24afc2/1877242970bb7a92b5c8ee7bc5c5e5ec87877890.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 7</title>
</head>
<body>
	<p style="letter-spacing: 0.1em">
		The toy brought back fond memories of being lost in the rain forest.
	</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/avoid-inline-spacing"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[78fd32]Important line height in style attributes is wide enough", function () {
  it("Inapplicable Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/b3ba5eaa37846b4b01ca04ae6e5f2d54c4813c1d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 9</title>
</head>
<body>
	<p style="line-height: 1.2em">
		<span style="line-height: inherit !important; display: block; max-width: 200px;">
			The toy brought back fond memories of being lost in the rain forest.
		</span>
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

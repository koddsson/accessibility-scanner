import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[78fd32]Important line height in style attributes is wide enough", function () {
  afterEach(cleanup);

  it("Inapplicable Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/0f8063a09807c4bf8d5f7c796cbf0f2aa20e7e57.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 10</title>
</head>
<body>
	<p style="line-height: 1.2em">
		<span style="line-height: unset !important; display: block; max-width: 200px;">
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

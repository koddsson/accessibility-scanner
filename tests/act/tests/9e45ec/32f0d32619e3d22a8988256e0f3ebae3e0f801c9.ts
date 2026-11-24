import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[9e45ec]Important word spacing in style attributes is wide enough", function () {
  afterEach(cleanup);

  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/32f0d32619e3d22a8988256e0f3ebae3e0f801c9.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 3</title>
</head>
<body>
	<p style="display: none; word-spacing: 0.1em !important;">
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

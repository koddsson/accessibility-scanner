import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[9e45ec]Important word spacing in style attributes is wide enough", function () {
  afterEach(cleanup);

  it("Inapplicable Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/d32bae2609b7c0c66a1df8dbfc182fb10c16805d.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 7</title>
</head>
<body>
	<p style="word-spacing: 0.1em">
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

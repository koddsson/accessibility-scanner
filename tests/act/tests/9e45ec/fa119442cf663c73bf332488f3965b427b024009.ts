import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[9e45ec]Important word spacing in style attributes is wide enough", function () {
  afterEach(cleanup);

  it("Inapplicable Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/fa119442cf663c73bf332488f3965b427b024009.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 8</title>
</head>
<body>
	<p style="word-spacing: 0.1em">
		<span style="word-spacing: inherit !important;">
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

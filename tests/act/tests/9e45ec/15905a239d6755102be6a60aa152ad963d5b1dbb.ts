import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[9e45ec]Important word spacing in style attributes is wide enough", function () {
  it.skip("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/15905a239d6755102be6a60aa152ad963d5b1dbb.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
	<div style="font-size: 16px; word-spacing: 2px !important">
		<p style="font-size: 10px;">
			The toy brought back fond memories of being lost in the rain forest.
		</p>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/avoid-inline-spacing"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

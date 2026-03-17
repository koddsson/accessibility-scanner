import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[9e45ec]Important word spacing in style attributes is wide enough", function () {
  it.skip("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/8d2baed183149375922c23a9a5f42b52b627d713.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<div style="word-spacing: 0.1em !important">
		<p style="word-spacing: 0.2em !important;">
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

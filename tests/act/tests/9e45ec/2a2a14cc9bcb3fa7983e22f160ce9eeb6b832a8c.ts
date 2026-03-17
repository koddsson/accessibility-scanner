import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[9e45ec]Important word spacing in style attributes is wide enough", function () {
  it.skip("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/2a2a14cc9bcb3fa7983e22f160ce9eeb6b832a8c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<style>
		p {
			font-size: 25px;
		}
	</style>
	
	<p style="word-spacing: 4px !important">
		The toy brought back fond memories of being lost in the rain forest.
	</p>
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

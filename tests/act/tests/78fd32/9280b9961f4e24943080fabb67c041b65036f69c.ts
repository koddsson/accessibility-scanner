import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[78fd32]Important line height in style attributes is wide enough", function () {
  it.skip("Passed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/9280b9961f4e24943080fabb67c041b65036f69c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 8</title>
</head>
<body>
	<div style="line-height: 1em !important">
		<p style="line-height: 1.5em !important; max-width: 200px;">
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

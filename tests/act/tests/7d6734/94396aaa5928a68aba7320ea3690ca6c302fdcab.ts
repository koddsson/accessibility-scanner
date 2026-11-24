import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[7d6734]SVG element with explicit role has non-empty accessible name", function () {
  afterEach(cleanup);

  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/7d6734/94396aaa5928a68aba7320ea3690ca6c302fdcab.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<p>How many circles are there?</p>
	<svg xmlns="http://www.w3.org/2000/svg" role="img" width="100" height="100">
		<circle cx="50" cy="50" r="40" fill="yellow"></circle>
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
			1 circle
		</text>
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/svg-img-alt"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

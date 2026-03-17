import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ye5d6e]Document has an instrument to move focus to non-repeated content", function () {
  it.skip("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ye5d6e/f75c1d3e3e4d3ef33020e90c115c6f4245170486.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<head>
		<script src="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/click-on-enter.js"></script>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body onload="ClickOnEnter('skip-link')">
		<div role="link" onclick="location.assign('#main');" tabindex="0" id="skip-link">Skip to main content</div>

		<aside id="about-book">
			<p>The Romance of the Three Kingdoms is a 14th century historical novel.</p>
		</aside>

		<div id="main">
			<p>
				Unity succeeds division and division follows unity. One is bound to be replaced by the other after a long span
				of time.
			</p>
			<a href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/chapter2.html">Read Chapter 2</a>
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/bypass"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

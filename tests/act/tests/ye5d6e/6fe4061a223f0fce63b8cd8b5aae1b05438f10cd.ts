import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ye5d6e]Document has an instrument to move focus to non-repeated content", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ye5d6e/6fe4061a223f0fce63b8cd8b5aae1b05438f10cd.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<head>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<a href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/chapter2.html">Read Chapter 2</a>

		<aside id="about-book">
			<p>The Romance of the Three Kingdoms is a 14th century historical novel.</p>
		</aside>

		<div id="main">
			<p>
				Unity succeeds division and division follows unity. One is bound to be replaced by the other after a long span
				of time.
			</p>
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/bypass"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

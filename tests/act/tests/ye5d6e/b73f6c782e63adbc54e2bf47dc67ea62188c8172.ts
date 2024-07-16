import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ye5d6e]Document has an instrument to move focus to non-repeated content", function () {
  it("Passed Example 8 (https://act-rules.github.io/testcases/ye5d6e/b73f6c782e63adbc54e2bf47dc67ea62188c8172.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <html lang="en">
	<head>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<a href="#just-before-main">Skip to main content</a>

		<aside id="about-book">
			<p>The Romance of the Three Kingdoms is a 14th century historical novel.</p>
		</aside>

		<div id="main">
			<hr />
			<span id="just-before-main"></span>
			<p>
				Unity succeeds division and division follows unity. One is bound to be replaced by the other after a long span
				of time.
			</p>
			<a href="/test-assets/bypass-blocks-cf77f2/chapter2.html">Read Chapter 2</a>
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

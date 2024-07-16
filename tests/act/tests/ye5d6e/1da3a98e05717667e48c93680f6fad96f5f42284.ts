import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ye5d6e]Document has an instrument to move focus to non-repeated content", function () {
  it("Failed Example 1 (https://act-rules.github.io/testcases/ye5d6e/1da3a98e05717667e48c93680f6fad96f5f42284.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <html lang="en">
	<head>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<a href="/test-assets/bypass-blocks-cf77f2/chapter2.html">Read Chapter 2</a>

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

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

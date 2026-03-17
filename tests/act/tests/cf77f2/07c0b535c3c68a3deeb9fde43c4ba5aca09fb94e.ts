import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[cf77f2]Bypass Blocks of Repeated Content", function () {
  it("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/07c0b535c3c68a3deeb9fde43c4ba5aca09fb94e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>Comparing translations of the Romance of the Three Kingdoms, Chapter one</title>
	</head>
	<body>
		<nav id="local-navigation">
			<a href="#local-navigation">Skip to local navigation</a>
			<a href="#brewitt-taylor">Skip to Brewitt-Taylor's translation</a>
			<a href="#roberts">Skip to Roberts' translation</a>
			<a href="#yu">Skip to Yu's translation</a>
			<a href="#about-book">Skip to information about the book</a>
		</nav>

		<aside id="about-book">
			<p>The Romance of the Three Kingdoms is a 14th century historical novel.</p>
		</aside>

		<div id="main">
			<p id="brewitt-taylor">
				Three Heroes Swear Brotherhood in the Peach Garden (Translation by Charles Henry Brewitt-Taylor)
			</p>
			<p>
				The world under heaven, after a long period of division, tends to unite; after a long period of union, tends to
				divide.
			</p>

			<p id="roberts">Three Bold Spirits Plight Mutual Faith in the Peach Garden (Translation by Moss Roberts)</p>
			<p>The empire, long divided, must unite; long united, must divide. Thus it has ever been.</p>

			<p id="yu">Three Heroes Swear Brotherhood at a Feast in the Peach Garden (Translation by Yu Sumei)</p>
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

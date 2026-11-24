import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[047fe0]Document has heading for non-repeated content", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/047fe0/81d501e52085d9e5712e241bdd24708e7cb4a301.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/styles.css" />
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<nav id="chapters-navigation">
			<ol>
				<li><a>Chapter 1</a></li>
				<li><a href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/chapter2.html">Chapter 2</a></li>
			</ol>
		</nav>

		<div id="main">
			<h1 class="off-screen">Three Heroes Swear Brotherhood at a Feast in the Peach Garden</h1>
			<p>
				Unity succeeds division and division follows unity. One is bound to be replaced by the other after a long span
				of time.
			</p>
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/bypass"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

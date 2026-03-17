import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[047fe0]Document has heading for non-repeated content", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/047fe0/8e7af0a95841a94b2d1dbee0860b4719c2085945.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<!-- Navigational block of content starts here -->
		<h1>Content</h1>
		<ol>
			<li><a>Chapter 1</a></li>
			<li><a href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/chapter2.html">Chapter 2</a></li>
		</ol>
		<!-- Navigational block of content ends here -->

		<!-- Main block of content starts here -->
		<h1>Three Heroes Swear Brotherhood at a Feast in the Peach Garden</h1>
		<p>
			Unity succeeds division and division follows unity. One is bound to be replaced by the other after a long span of
			time.
		</p>
		<!-- Main block of content ends here -->
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

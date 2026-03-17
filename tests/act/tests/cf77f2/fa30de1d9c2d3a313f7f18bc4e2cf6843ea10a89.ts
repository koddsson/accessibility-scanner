import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[cf77f2]Bypass Blocks of Repeated Content", function () {
  it.skip("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/fa30de1d9c2d3a313f7f18bc4e2cf6843ea10a89.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<script src="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/toggle-display.js"></script>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<a href="#" onclick="toggleHidden('chapters-navigation')">Toggle table of content</a>

		<nav id="chapters-navigation">
			<ol>
				<li><a>Chapter 1</a></li>
				<li><a href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/chapter2.html">Chapter 2</a></li>
			</ol>
		</nav>

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

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/bypass"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

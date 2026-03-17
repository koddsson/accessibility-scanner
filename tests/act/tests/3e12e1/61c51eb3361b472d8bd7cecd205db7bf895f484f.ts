import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[3e12e1]Block of repeated content is collapsible", function () {
  it.skip("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/3e12e1/61c51eb3361b472d8bd7cecd205db7bf895f484f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<script src="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/toggle-display.js"></script>
		<link rel="stylesheet" href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/styles.css" />
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<button onclick="toggleHidden('chapters-navigation')" class="visible-on-focus">Toggle repeated content</button>

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

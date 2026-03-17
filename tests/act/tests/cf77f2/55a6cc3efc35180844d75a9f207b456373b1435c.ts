import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[cf77f2]Bypass Blocks of Repeated Content", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/55a6cc3efc35180844d75a9f207b456373b1435c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<head>
		<title>The Three Kingdoms, Chapter 1</title>
	</head>
	<body>
		<a href="/WAI/content-assets/wcag-act-rules/test-assets/bypass-blocks-cf77f2/chapter2.html">Read Chapter 2</a>

		<aside id="about-book">
			The Romance of the Three Kingdoms is a 14th century historical novel.
		</aside>

		<div id="main">
			<strong style="font-size: 18pt">Three Heroes Swear Brotherhood at a Feast in the Peach Garden</strong>
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

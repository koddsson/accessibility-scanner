import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[80f0bf]Audio or video element avoids automatically playing audio", function () {
  it.skip("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/80f0bf/7d3d7214d9fca81a8a09a819665871a474f85548.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 2</title>
</head>
<body>
	<video autoplay>
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/silent.mp4" type="video/mp4" />
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/silent.webm" type="video/webm" />
	</video>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/no-autoplay-audio"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

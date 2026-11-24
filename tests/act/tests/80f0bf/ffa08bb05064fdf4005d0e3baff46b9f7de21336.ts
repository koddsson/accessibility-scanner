import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[80f0bf]Audio or video element avoids automatically playing audio", function () {
  afterEach(cleanup);

  it("Inapplicable Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/80f0bf/ffa08bb05064fdf4005d0e3baff46b9f7de21336.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 1</title>
</head>
<body>
	<video autoplay muted>
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.mp4" type="video/mp4" />
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.webm" type="video/webm" />
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

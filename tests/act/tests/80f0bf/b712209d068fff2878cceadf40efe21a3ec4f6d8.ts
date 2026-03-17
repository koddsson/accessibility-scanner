import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[80f0bf]Audio or video element avoids automatically playing audio", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/80f0bf/b712209d068fff2878cceadf40efe21a3ec4f6d8.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<video autoplay>
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.mp4" type="video/mp4" />
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.webm" type="video/webm" />
	</video>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/no-autoplay-audio"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

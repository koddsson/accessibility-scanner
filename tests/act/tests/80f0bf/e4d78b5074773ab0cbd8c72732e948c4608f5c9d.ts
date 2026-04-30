import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[80f0bf]Audio or video element avoids automatically playing audio", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/80f0bf/e4d78b5074773ab0cbd8c72732e948c4608f5c9d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<video autoplay>
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.mp4#t=8,10" type="video/mp4" />
		<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.webm#t=8,10" type="video/webm" />
	</video>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/no-autoplay-audio"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

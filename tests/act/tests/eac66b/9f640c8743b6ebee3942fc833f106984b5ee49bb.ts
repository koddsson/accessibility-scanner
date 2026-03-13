import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[eac66b]Video element auditory content has accessible alternative", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/9f640c8743b6ebee3942fc833f106984b5ee49bb.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<video src="/WAI/content-assets/wcag-act-rules/test-assets/perspective-video/perspective-video.mp4" controls>
		<track src="/WAI/content-assets/wcag-act-rules/test-assets/perspective-video/perspective-caption.vtt" kind="captions" />
	</video>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/video-caption"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

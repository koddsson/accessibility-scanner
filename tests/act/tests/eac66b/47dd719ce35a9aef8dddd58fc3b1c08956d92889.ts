import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[eac66b]Video element auditory content has accessible alternative", function () {
  it.skip("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/47dd719ce35a9aef8dddd58fc3b1c08956d92889.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<p>
		Web Accessibility Perspectives: Keyboard Accessibility. Not being able to use your computer because your mouse
		doesn't work, is frustrating. Many people use only the keyboard to navigate websites. Either through preference or
		circumstance. This is solved by keyboard compatibility. Keyboard compatibility is described in WCAG. See the video
		below to watch the same information again in video form.
	</p>
	<video src="/WAI/content-assets/wcag-act-rules/test-assets/perspective-video/perspective-video.mp4" controls></video>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/video-caption"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

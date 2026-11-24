import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[eac66b]Video element auditory content has accessible alternative", function () {
  afterEach(cleanup);

  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/4b86a2baaa324f721a4bf646b87993be599b82a1.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<p>
		Not being able to use your computer because your mouse doesn't work, is frustrating. Either through preference or
		circumstance. This is solved by keyboard compatibility. Keyboard compatibility is described in WCAG. See the video
		below to watch the same information again in video form.
	</p>
	<video src="/WAI/content-assets/wcag-act-rules/test-assets/perspective-video/perspective-video.mp4" controls></video>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/video-caption"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

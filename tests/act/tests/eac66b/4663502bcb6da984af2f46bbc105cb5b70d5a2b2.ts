import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[eac66b]Video element auditory content has accessible alternative", function () {
  afterEach(cleanup);

  it("Inapplicable Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/4663502bcb6da984af2f46bbc105cb5b70d5a2b2.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
	<video src="/WAI/content-assets/wcag-act-rules/test-assets/perspective-video/perspective-video-silent.mp4" controls></video>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/video-caption"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

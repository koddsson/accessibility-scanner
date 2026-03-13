import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[eac66b]Video element auditory content has accessible alternative", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/67da88481f2c979c57d48e085146a39938d6221a.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<video src="/WAI/content-assets/wcag-act-rules/test-assets/perspective-video/perspective-video.mp4" controls></video>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/video-caption"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

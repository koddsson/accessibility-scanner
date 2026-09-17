import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  it("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/1e657a8e23e1ec1f52032bc68d5403cea50bc003.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<a href="https://act-rules.github.io/" aria-label="ACT rules">
			<circle cx="50" cy="40" r="35" />
		</a>

		<a href="https://act-rules.github.io/">
			<text x="50" y="90" text-anchor="middle">
				ACT rules
			</text>
		</a>
	</svg>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

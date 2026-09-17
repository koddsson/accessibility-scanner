import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  it("Passed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/39078d73e0c274100c3518259a3e30fe52ecd3b3.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<span
		role="link"
		tabindex="0"
		onclick="location='/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/index.html'"
	>
		Link text
	</span>

	<span
		role="link"
		tabindex="0"
		onclick="location='/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/index.html'"
	>
		Link text
	</span>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

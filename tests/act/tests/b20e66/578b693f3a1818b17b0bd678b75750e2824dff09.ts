import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/578b693f3a1818b17b0bd678b75750e2824dff09.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<span
		role="link"
		tabindex="0"
		onclick="location='/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/about/contact.html'"
	>
		Link text
	</span>

	<span
		role="link"
		tabindex="0"
		onclick="location='/WAI/content-assets/wcag-act-rules/test-assets/links-with-identical-names-serve-equivalent-purpose-b20e66/admissions/contact.html'"
	>
		Link text
	</span>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

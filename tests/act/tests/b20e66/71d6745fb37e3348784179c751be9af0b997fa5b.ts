import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b20e66]Links with identical accessible names have equivalent purpose", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b20e66/71d6745fb37e3348784179c751be9af0b997fa5b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
	<a href="https://act-rules.github.io/"><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/act-logo.png" alt="ACT rules"/></a>
	<a href="https://www.w3.org/community/act-r/"><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/act-logo.png" alt="ACT rules"/></a>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/5fd6fda771cf8810eef5166464622d6979e0406e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<iframe src="/WAI/content-assets/wcag-act-rules/test-assets/sc2-4-2-title-page-with-title.html"></iframe>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

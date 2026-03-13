import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b5c3f8]HTML page has lang attribute", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b5c3f8/4ea0280617a1b71dcc327356484f8767919b0f40.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang=" ">
	<body>
		The quick brown fox jumps over the lazy dog.
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/html-has-lang"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

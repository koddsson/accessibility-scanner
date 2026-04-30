import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/efa1e0438bb515332ec6b4d943044c336ca77fab.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<body>
		<title>Title of the page.</title>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.documentElement)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/document-title"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

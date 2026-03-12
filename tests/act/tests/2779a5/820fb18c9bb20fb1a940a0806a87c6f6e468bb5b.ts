import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/820fb18c9bb20fb1a940a0806a87c6f6e468bb5b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<h1>this page has no title</h1>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

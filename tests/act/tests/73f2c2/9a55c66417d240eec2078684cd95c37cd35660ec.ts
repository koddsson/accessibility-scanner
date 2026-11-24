import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[73f2c2]`autocomplete` attribute has valid value", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/9a55c66417d240eec2078684cd95c37cd35660ec.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<label>Email<input autocomplete="work shipping email"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/autocomplete-valid"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

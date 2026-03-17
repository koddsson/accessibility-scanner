import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[8fc3b6]Object element rendering non-text content has non-empty accessible name", function () {
  it("Failed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/8fc3b6/f6b0a52f8bb37ab0a8b290237add5be669a28b2f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 6</title>
</head>
<body>
	<object data="/WAI/content-assets/wcag-act-rules/test-assets/moon-audio/moon-speech.mp3" alt="Moon speech"></object>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/object-alt"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

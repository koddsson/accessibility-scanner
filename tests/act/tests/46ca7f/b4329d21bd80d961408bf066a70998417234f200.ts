import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[46ca7f]Element marked as decorative is not exposed", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/46ca7f/b4329d21bd80d961408bf066a70998417234f200.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<svg role="none" aria-label="Yellow circle">
		<circle cx="50" cy="50" r="40" fill="yellow"></circle>
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/presentation-role-conflict"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

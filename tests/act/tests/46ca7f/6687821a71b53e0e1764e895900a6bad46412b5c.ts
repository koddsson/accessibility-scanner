import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[46ca7f]Element marked as decorative is not exposed", function () {
  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/46ca7f/6687821a71b53e0e1764e895900a6bad46412b5c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<svg role="none">
		<circle cx="50" cy="50" r="40" fill="yellow"></circle>
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/presentation-role-conflict"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

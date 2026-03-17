import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/395965215132ccf7f66c0c464c12bd48f416b1ca.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<p>Happy new year!</p>
	<svg height="200" xmlns="http://www.w3.org/2000/svg" role="none">
		<polygon points="100,10 40,180 190,60 10,60 160,180" fill="yellow" />
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/decorative-image"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

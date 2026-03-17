import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e88epe]Image not in the accessibility tree is decorative", function () {
  it.skip("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/57982b4d5dad90f3f2c06d5e0233694c46842bd0.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<p>Happy new year!</p>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/fireworks.jpg" role="none" alt="ignore me" />
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

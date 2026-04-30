import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[46ca7f]Element marked as decorative is not exposed", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/46ca7f/b40e6ce081099b8bf0f76a43f4c27f12df342ddd.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="" aria-hidden="true" />
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

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[23a2a8]Image has non-empty accessible name", function () {
  it("Passed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/13b8678881fba03e7465f82b5550abc5093f7968.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 7</title>
</head>
<body>
	<img role="none" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/background.png" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/image-alt","https://dequeuniversity.com/rules/axe/4.11/role-img-alt"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

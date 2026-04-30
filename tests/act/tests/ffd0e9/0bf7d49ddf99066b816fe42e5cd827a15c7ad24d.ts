import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[ffd0e9]Heading has non-empty accessible name", function () {
  it("Failed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ffd0e9/0bf7d49ddf99066b816fe42e5cd827a15c7ad24d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 8</title>
</head>
<body>
	<h1 aria-label="" role="none"><span aria-hidden="true">ACT rules</span></h1>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/empty-heading"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

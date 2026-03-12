import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc659a]Meta element has no refresh delay", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/96c7657d21888cd05edd297d44a8fd554b21c908.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="30; URL='https://w3.org'" />
</head>
<body>
	<p>This page redirects afte 30 seconds.</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-refresh"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

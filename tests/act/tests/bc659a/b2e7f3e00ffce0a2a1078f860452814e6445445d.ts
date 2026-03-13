import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc659a]Meta element has no refresh delay", function () {
  it.skip("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/b2e7f3e00ffce0a2a1078f860452814e6445445d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="0: https://w3.org" />
	<meta http-equiv="refresh" content="5; https://w3.org" />
</head>
<body>
	<p>This page refreshes after 5 seconds.</p>
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

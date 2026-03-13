import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[akn7bn]Iframe with interactive elements is not excluded from tab-order", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/akn7bn/62673162e22ee1e95e962522b1d1c3b549dbfc49.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<iframe tabindex="-1" srcdoc="<a href='/'>Home</a>"></iframe>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-focusable-content"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

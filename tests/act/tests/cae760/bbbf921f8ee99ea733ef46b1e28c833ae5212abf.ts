import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[cae760]Iframe element has non-empty accessible name", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cae760/bbbf921f8ee99ea733ef46b1e28c833ae5212abf.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<iframe name="Grocery List" src="/WAI/content-assets/wcag-act-rules/test-assets/SC4-1-2-frame-doc.html"> </iframe>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

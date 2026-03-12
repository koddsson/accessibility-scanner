import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[23a2a8]Image has non-empty accessible name", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/32bfac8a98cc212aa7bf9151bf40f665a7f51696.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<img alt="W3C logo" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5f99a7]ARIA attribute is defined in WAI-ARIA", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5f99a7/261dcd3214e87532fc2f9c8db7fdce05de9e07f0.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<article aria-atomic="true">This is a description of something cool...</article>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

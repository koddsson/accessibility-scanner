import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 8 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/e277de30edb9e550d8f9d5a72e1e3adde961d01d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 8</title>
</head>
<body>
	<a href="https://www.w3.org/WAI"><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" aria-labelledby="id1"/></a>
	<div id="id1">Web Accessibility Initiative (WAI)</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

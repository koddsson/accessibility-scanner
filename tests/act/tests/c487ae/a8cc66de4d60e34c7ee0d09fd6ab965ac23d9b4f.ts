import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/a8cc66de4d60e34c7ee0d09fd6ab965ac23d9b4f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<a href="https://www.w3.org/WAI"> Web Accessibility Initiative (WAI) </a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

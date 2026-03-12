import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/5d16da98a4089b29ff76c611036c65e1c504c7bc.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 7</title>
</head>
<body>
	<a href="https://www.w3.org/WAI"
		><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt="" />Web Accessibility Initiative (WAI)</a
	>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

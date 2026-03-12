import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/4493c4b542c8e059e8423c77945ce5895428ab88.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
	<a href="https://www.w3.org/WAI" title="Web Accessibility Initiative"
		><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" alt=""
	/></a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

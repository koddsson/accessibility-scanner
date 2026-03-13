import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it.skip("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/954326e5ba700d4616d924807f427002816e9fc3.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<a href="https://www.w3.org/WAI"><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" role="presentation"/></a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/area-alt","https://dequeuniversity.com/rules/axe/4.11/link-name"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

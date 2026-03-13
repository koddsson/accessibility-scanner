import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it.skip("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/97b115a032fc4178230306e2d0f4e334b2cfe8a9.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<a href="https://www.w3.org/WAI"></a>
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

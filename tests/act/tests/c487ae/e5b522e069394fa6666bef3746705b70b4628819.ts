import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/e5b522e069394fa6666bef3746705b70b4628819.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 5</title>
</head>
<body>
	<a href="https://www.w3.org/WAI"><img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" title=""/></a>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

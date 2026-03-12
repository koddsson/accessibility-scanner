import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[23a2a8]Image has non-empty accessible name", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/2f35ed62ed14afb6d9e8b886e95e846f0cfa0d2a.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 5</title>
</head>
<body>
	<img alt="" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/background.png" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

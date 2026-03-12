import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[23a2a8]Image has non-empty accessible name", function () {
  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/23a2a8/d70470a37db713810be85275e5d0c698f85ab320.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 5</title>
</head>
<body>
	<img role="none" tabindex="0" src="/WAI/content-assets/wcag-act-rules/test-assets/shared/w3c-logo.png" />
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

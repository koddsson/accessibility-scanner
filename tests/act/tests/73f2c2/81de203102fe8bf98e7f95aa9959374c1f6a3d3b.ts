import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[73f2c2]`autocomplete` attribute has valid value", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/81de203102fe8bf98e7f95aa9959374c1f6a3d3b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<label>Email<input autocomplete="work,email"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

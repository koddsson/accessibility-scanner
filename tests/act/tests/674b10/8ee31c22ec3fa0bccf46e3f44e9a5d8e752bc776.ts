import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[674b10]Role attribute has valid value", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/8ee31c22ec3fa0bccf46e3f44e9a5d8e752bc776.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<label>Search: <input type="text" role="searchfield searchbox" placeholder="Enter 3 or more characters"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[73f2c2]Autocomplete attribute has valid value", function () {
  it("Failed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/55ce632e85a0243abf196c59242b2af699e5c0d4.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 7</title>
</head>
<body>
	<label>Address<input autocomplete="address-line1 address-line2"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

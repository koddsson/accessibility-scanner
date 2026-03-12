import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[bc659a]Meta element has no refresh delay", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/b5ca868de7980f6944142ecdb849f47ad2cdfb5c.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="refresh" content="72001; https://w3.org" />
</head>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

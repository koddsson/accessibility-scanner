import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5c01ea]ARIA state or property is permitted", function () {
  it("Passed Example 11 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/0401164ef77abe96fd6502d35ed04952a057a8fe.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 11</title>
</head>
<body>
	<label>Password<input type="password" aria-required="true"/></label>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

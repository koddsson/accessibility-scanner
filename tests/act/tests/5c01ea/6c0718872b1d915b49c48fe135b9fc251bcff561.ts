import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[5c01ea]ARIA state or property is permitted", function () {
  it("Passed Example 9 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/6c0718872b1d915b49c48fe135b9fc251bcff561.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 9</title>
</head>
<body>
	<svg xmlns="http://www.w3.org/2000/svg" role="graphics-object" width="100" height="100" aria-label="yellow circle">
		<circle cx="50" cy="50" r="40" fill="yellow"></circle>
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

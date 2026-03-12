import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[6a7281]ARIA state or property has valid value", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/e1bd70b33e2d53e3b9bc105a5cad59a76b4c54d5.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<div role="gridcell" aria-rowindex="2.5">Fred</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

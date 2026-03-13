import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/1a0ee1b5549d2f1eebd337e85cae8487331ab723.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<div role="grid">
		<div role="row">
			<div role="columnheader">Room</div>
			<div role="columnheader">Occupant</div>
		</div>
		<div role="row">
			<div role="gridcell">1A</div>
		</div>
		<div role="row">
			<div role="gridcell">2A</div>
		</div>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/th-has-data-cells"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

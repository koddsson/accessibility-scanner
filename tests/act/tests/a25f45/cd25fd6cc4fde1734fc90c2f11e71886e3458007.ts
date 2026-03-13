import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/cd25fd6cc4fde1734fc90c2f11e71886e3458007.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<table>
		<tr>
			<th id="headOfColumn1">Projects</th>
			<th id="headOfColumn2">Objective</th>
		</tr>
	</table>
	
	<table>
		<tr>
			<td headers="headOfColumn1">15%</td>
			<td headers="headOfColumn2">10%</td>
		</tr>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/td-headers-attr"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

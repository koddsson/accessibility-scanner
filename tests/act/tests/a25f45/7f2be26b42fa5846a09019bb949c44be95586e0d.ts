import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/7f2be26b42fa5846a09019bb949c44be95586e0d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<table>
		<tr>
			<th id="headerOfColumn1">Projects</th>
			<th id="headerOfColumn2">Objective</th>
		</tr>
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

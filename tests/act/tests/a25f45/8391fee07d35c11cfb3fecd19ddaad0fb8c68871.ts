import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/8391fee07d35c11cfb3fecd19ddaad0fb8c68871.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<table>
		<thead>
			<tr>
				<td role="columnheader" id="header1">Projects</td>
				<td role="columnheader" id="header2">Objective</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td headers="header1">15%</td>
				<td headers="header2">10%</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/td-headers-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

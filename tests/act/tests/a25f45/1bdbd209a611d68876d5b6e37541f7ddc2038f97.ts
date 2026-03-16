import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Failed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/1bdbd209a611d68876d5b6e37541f7ddc2038f97.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 4</title>
</head>
<body>
	<table>
		<tr>
			<td>
				<span id="headerProject">Projects</span>
			</td>
			<td>
				<span id="headerObjective">Objective</span>
			</td>
		</tr>
		<tr>
			<td headers="headerProject">
				15%
			</td>
			<td headers="headerObjective">
				10%
			</td>
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

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/664972feaac1097f9365d73aac844c81fa927fa2.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<table>
		<thead>
			<tr>
				<th>Rate</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>15%</td>
			</tr>
		</tbody>
	</table>
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

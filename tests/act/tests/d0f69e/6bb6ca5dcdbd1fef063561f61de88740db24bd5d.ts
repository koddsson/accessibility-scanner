import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/6bb6ca5dcdbd1fef063561f61de88740db24bd5d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<table>
		<tr>
			<th id="col1">Country</th>
			<th id="col2">Starting with a Z</th>
		</tr>
		<tr>
			<td>Zambia</td>
			<td headers="col1">Zimbabwe</td>
		</tr>
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

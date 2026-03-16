import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/4dba1a02d3852eecca6f2f50e1812bce802a42de.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<table role="grid" aria-label="Meal times">
		<thead>
			<tr>
				<td></td>
				<th scope="col" role="columnheader">Breakfast</th>
				<th scope="col" role="columnheader">Lunch</th>
				<th scope="col" role="columnheader">Dinner</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row" role="rowheader">Day 1</th>
				<td>8:00</td>
				<td>13:00</td>
				<td>18:00</td>
			</tr>
		</tbody>
	</table>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/th-has-data-cells"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

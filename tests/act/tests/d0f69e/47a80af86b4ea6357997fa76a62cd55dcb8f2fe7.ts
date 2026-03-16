import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/47a80af86b4ea6357997fa76a62cd55dcb8f2fe7.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<table>
		<caption>
			Opening hours
		</caption>
		<tr>
			<th>Day</th>
			<th>Morning</th>
			<th>Afternoon</th>
		</tr>
		<tr>
			<th>Mon-Fri</th>
			<td>8-12</td>
			<td>14-17</td>
		</tr>
		<tr>
			<th>Sat-Sun</th>
			<td>10-14</td>
			<td>Closed</td>
		</tr>
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

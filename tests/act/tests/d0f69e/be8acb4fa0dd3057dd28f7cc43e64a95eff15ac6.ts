import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[d0f69e]Table header cell has assigned cells", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/d0f69e/be8acb4fa0dd3057dd28f7cc43e64a95eff15ac6.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<div role="table" aria-label="Temperatures">
		<div role="rowgroup">
			<div role="row">
				<span role="columnheader">Month</span>
				<span role="columnheader">Top Temperature</span>
			</div>
		</div>
		<div role="rowgroup">
			<div role="row">
				<span role="cell">July</span>
				<span role="cell">40 C</span>
			</div>
			<div role="row">
				<span role="cell">August</span>
				<span role="cell">45 C</span>
			</div>
		</div>
	</div>
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

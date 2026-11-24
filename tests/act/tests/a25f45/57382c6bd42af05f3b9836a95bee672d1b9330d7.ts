import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  afterEach(cleanup);

  it("Inapplicable Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/57382c6bd42af05f3b9836a95bee672d1b9330d7.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 4</title>
</head>
<body>
	<div role="table">
		<div role="row">
			<div role="columnheader" id="header1">Projects</div>
			<div role="columnheader" id="header2">Exams</div>
		</div>
		<div role="row">
			<div role="cell" headers="header2">15%</div>
			<div role="cell" headers="header1">15%</div>
		</div>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/td-headers-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

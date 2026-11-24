import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner.js";

const parser = new DOMParser();

describe("[a25f45]Headers attribute specified on a cell refers to cells in the same table element", function () {
  it("Inapplicable Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/a25f45/76b79146e3be6b8ea6920df93b68352b8b9d3c8b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<style>
		.notInPage {
			position: absolute;
			left: -9999px;
			top: -9999px;
		}
	</style>
	<table class="notInPage">
		<tr>
			<th id="header1">Project Status</th>
			<th id="header2">Objective</th>
		</tr>
		<tr>
			<td headers="header1">15%</td>
			<td headers="header2">10%</td>
		</tr>
	</table>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/td-headers-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

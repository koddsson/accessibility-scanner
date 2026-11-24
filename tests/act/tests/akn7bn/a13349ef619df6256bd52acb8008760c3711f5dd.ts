import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[akn7bn]Iframe with interactive elements is not excluded from tab-order", function () {
  afterEach(cleanup);

  it("Inapplicable Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/akn7bn/a13349ef619df6256bd52acb8008760c3711f5dd.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Inapplicable Example 6</title>
</head>
<body>
	<iframe id="myFrame" title="Links" srcdoc="<a href='/'>Home</a>"></iframe>
	<div>
		<button id="ppButton" onclick="openDialog()">Privacy policy details</button>
	</div>
	<dialog id="ppDialog" aria-labelledby="dialogLabel">
		<h2 id="dialogLabel">Privacy Policy</h2>
		<p>We store no data.</p>
		<button id="cancel" onclick="ppDialog.close()">Cancel</button>
	</dialog>
	<script>
		const openDialog = () => {
			ppDialog.showModal()
			myFrame.tabIndex = '-1'
		}
		ppDialog.addEventListener('close', () => (myFrame.tabIndex = 0))
		window.addEventListener('DOMContentLoaded', openDialog)
	</script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/frame-focusable-content"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  afterEach(cleanup);

  it("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/8122ef64b86fcd30dadeea664029af028382d1b4.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<label for="tag_combo" id="tag_label">Tag</label>
	<input type="text" id="tag_combo" role="combobox" aria-expanded="true" aria-controls="popup_listbox" />
	<ul role="listbox" id="popup_listbox" aria-labelledby="tag_label">
		<li role="option">Zebra</li>
		<li role="option" id="selected_option">Zoom</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/aria-required-attr"];
    const relevant = results.filter(r => expectedUrls.includes(r.url) && !r.needsReview);
    expect(relevant).to.be.empty;
  });
});

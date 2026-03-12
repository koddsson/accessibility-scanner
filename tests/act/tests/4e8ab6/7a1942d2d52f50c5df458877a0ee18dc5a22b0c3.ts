import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  it("Failed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/7a1942d2d52f50c5df458877a0ee18dc5a22b0c3.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 5</title>
</head>
<body>
	<label for="tag_combo">Tag</label>
	<input type="text" id="tag_combo" role="combobox" aria-controls="popup_listbox" />
	<ul role="listbox" id="popup_listbox">
		<li role="option">Zebra</li>
		<li role="option" id="selected_option">Zoom</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

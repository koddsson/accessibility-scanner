import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[in6db8]ARIA required ID references exist", function () {
  // Skipped: This test requires Shadow DOM with script execution, which DOMParser does not support.
  it.skip("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/in6db8/ee9eeebf0a0b1a514df6202443345d999d2bd575.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<div id="aria-listbox">
		<label for="tag_combo">Tag</label>
		<input
			type="text"
			id="tag_combo"
			role="combobox"
			aria-expanded="true"
			aria-controls="popup_listbox"
			aria-activedescendant="selected_option"
		/>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

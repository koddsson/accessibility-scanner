import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2ee8b8]Visible label is part of accessible name", function () {
  it.skip("Passed Example 6 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/efa9543339cdad5412c7719b266a633a29ce149e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 6</title>
</head>
<body>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
	<style>
		button {
			font-family: 'Material Icons';
		}
	</style>
	<button aria-label="Find">search</button>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/label-content-name-mismatch"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

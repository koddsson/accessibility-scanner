import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2779a5]HTML page has non-empty title", function () {
  it("Passed Example 5 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/0ad882dffaf6edd16058119e1c513b4746b0ac27.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>Title of the page.</title>
	</head>
	<body>
		<title></title>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

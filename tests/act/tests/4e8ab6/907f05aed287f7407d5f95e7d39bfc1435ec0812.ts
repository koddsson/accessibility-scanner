import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[4e8ab6]Element with role attribute has required states and properties", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/907f05aed287f7407d5f95e7d39bfc1435ec0812.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<div role="switch">
		Toggle me
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

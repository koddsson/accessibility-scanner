import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[in6db8]ARIA required ID references exist", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/in6db8/7cdf98178f57c1f64c1bfbe0801b7a5e2e73a89f.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 2</title>
</head>
<body>
	<main>Lorem ipsum...</main>
	<div
		role="scrollbar"
		aria-controls="content-1 content-2"
		aria-orientation="vertical"
		aria-valuemax="100"
		aria-valuemin="0"
		aria-valuenow="25"
	></div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

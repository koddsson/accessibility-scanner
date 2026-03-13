import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[in6db8]ARIA required ID references exist", function () {
  it("Passed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/in6db8/ad53952b46a372bddc3d34d82427c9ccbc6ecaa6.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 1</title>
</head>
<body>
	<main id="content">Lorem ipsum...</main>
	<div
		role="scrollbar"
		aria-controls="content"
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

    expect(results).to.be.empty;
  });
});

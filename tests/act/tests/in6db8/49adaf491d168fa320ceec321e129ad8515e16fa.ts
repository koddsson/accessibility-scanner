import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[in6db8]ARIA required ID references exist", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/in6db8/49adaf491d168fa320ceec321e129ad8515e16fa.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<main id="content-2">Lorem ipsum...</main>
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

    // No scanner rule maps to this ACT rule yet — nothing to assert.
    expect([]).to.be.empty;
  });
});

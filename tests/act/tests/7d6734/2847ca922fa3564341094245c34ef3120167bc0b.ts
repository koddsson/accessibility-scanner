import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[7d6734]SVG element with explicit role has non-empty accessible name", function () {
  it("Failed Example 1 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/7d6734/2847ca922fa3564341094245c34ef3120167bc0b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 1</title>
</head>
<body>
	<p>How many circles are there?</p>
	<svg xmlns="http://www.w3.org/2000/svg" role="img">
		<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow"></circle>
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

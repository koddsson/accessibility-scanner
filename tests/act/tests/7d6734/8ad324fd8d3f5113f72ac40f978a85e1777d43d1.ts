import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[7d6734]SVG element with explicit role has non-empty accessible name", function () {
  it("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/7d6734/8ad324fd8d3f5113f72ac40f978a85e1777d43d1.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<p>How many circles are there?</p>
	<svg xmlns="https://www.w3.org/2000/svg">
		<circle
			role="graphics-symbol"
			cx="50"
			cy="50"
			r="40"
			stroke="green"
			stroke-width="4"
			fill="yellow"
			aria-label="1 circle"
		></circle>
	</svg>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

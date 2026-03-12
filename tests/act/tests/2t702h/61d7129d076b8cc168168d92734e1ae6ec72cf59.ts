import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2t702h]Summary element has non-empty accessible name", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2t702h/61d7129d076b8cc168168d92734e1ae6ec72cf59.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<span id="opening-times">Opening times</span>
	<details>
		<summary aria-labelledby="opening-times"></summary>
		<p>This is a website. We are available 24/7.</p>
	</details>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

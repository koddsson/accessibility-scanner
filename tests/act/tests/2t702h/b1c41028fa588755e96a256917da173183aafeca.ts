import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[2t702h]Summary element has non-empty accessible name", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2t702h/b1c41028fa588755e96a256917da173183aafeca.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<details>
		<p>This is a website. We are available 24/7.</p>
		<summary>Opening times</summary>
	</details>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

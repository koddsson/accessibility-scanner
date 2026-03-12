import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[m6b1q3]Menuitem has non-empty accessible name", function () {
  it("Passed Example 4 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/m6b1q3/c05155744a79e6ff72f1b691b8bae15338e8146b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 4</title>
</head>
<body>
	<div role="menu">
		<button role="menuitem" title="New file">
			<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/file.svg" alt="" />
		</button>
	</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

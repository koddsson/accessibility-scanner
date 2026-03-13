import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[m6b1q3]Menuitem has non-empty accessible name", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/m6b1q3/83a0c030f9172c3d8d862d01138e75ec7aaf4f4e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 3</title>
</head>
<body>
	<div role="menu">
		<button role="menuitem" aria-labelledby="newfile">
			<img src="/WAI/content-assets/wcag-act-rules/test-assets/shared/file.svg" alt="" />
			<span id="newfile" hidden>New file</span>
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

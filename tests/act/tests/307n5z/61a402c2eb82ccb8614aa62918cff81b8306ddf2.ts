import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[307n5z]Element with presentational children has no focusable content", function () {
  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/61a402c2eb82ccb8614aa62918cff81b8306ddf2.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 3</title>
</head>
<body>
	<ul role="menu">
		<li role="menuitemcheckbox" aria-checked="true">
			<input type="checkbox" checked />
			Sort by Last Modified
		</li>
	</ul>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

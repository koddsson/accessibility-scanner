import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 10 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/b9a3949e2a7521698472a966c782434c4d9ce6fb.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 10</title>
</head>
<body>
	<img src="/WAI/content-assets/wcag-act-rules/test-assets/c487ae/planets.jpg" width="145" height="126" alt="Planets" usemap="#planetmap" />
	
	<map name="planetmap">
		<area shape="rect" coords="0,0,30,100" href="sun.htm" alt="Sun" />
	</map>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

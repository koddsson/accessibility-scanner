import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[78fd32]Important line height in style attributes is wide enough", function () {
  it.skip("Passed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/203a13b314695fc2abc6163b3ac7940ab1c4a9ed.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Passed Example 2</title>
</head>
<body>
	<style>
		p {
			font-size: 20px;
		}
	</style>
	
	<p style="line-height: 30px !important; max-width: 200px;">
		The toy brought back fond memories of being lost in the rain forest.
	</p>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/avoid-inline-spacing"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

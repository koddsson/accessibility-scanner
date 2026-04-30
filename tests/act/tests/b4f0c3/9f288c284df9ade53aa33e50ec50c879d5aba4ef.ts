import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b4f0c3]Meta viewport allows for zoom", function () {
  it("Failed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/9f288c284df9ade53aa33e50ec50c879d5aba4ef.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>Simple page showing random text</title>
		<meta name="viewport" content="maximum-scale=invalid" />
	</head>
	<body>
		<p>
			Lorem ipsum
		</p>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-viewport"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

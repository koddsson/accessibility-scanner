import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b4f0c3]Meta viewport allows for zoom", function () {
  it("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/4ade33e41dda291c9078e56ca2a95c4825dbc1fe.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>Simple page showing random text</title>
		<meta name="viewport" content="maximum-scale=-1" />
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

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-viewport"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

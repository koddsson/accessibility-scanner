import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[b4f0c3]Meta viewport allows for zoom", function () {
  it("Failed Example 2 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/a1240b31761f65c92a8f6d08ed7105ee822d0ebc.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html>
	<head>
		<title>Simple page showing random text</title>
		<meta name="viewport" content="user-scalable=yes, initial-scale=0.8, maximum-scale=1.5" />
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
  });
});

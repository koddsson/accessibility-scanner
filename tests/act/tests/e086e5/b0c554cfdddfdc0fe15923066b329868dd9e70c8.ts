import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[e086e5]Form field has non-empty accessible name", function () {
  it("Failed Example 7 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/b0c554cfdddfdc0fe15923066b329868dd9e70c8.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<title>Failed Example 7</title>
</head>
<body>
	<div role="textbox">first name</div>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Passed Example 3 (https://act-rules.github.io/testcases/de46e4/2c6ce29c2934936b9dd032e87695bffae9bc514e.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html><html><head><title>Test</title></head><body><head><title>Test</title></head>
	<body>
		<p lang="en-US-GB">
			They wandered into a strange Tiki bar on the edge of the small beach town.
		</p>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 6 (https://act-rules.github.io/testcases/de46e4/bbbe2413e9ae6546057a024c50426225bb5729e9.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <html>
	<body>
		<article lang="en">
			<div lang="invalid">
				They wandered into a strange Tiki bar on the edge of the small beach town.
			</div>
		</article>
	</body>
</html>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Passed Example 4 (https://act-rules.github.io/testcases/de46e4/c39849b0dc83ea0262f90869b33d1937822a3316.html)", async () => {
    await fixture(`<!DOCTYPE html> <html>
	<body>
		<article lang="invalid">
			<div lang="en">
				They wandered into a strange Tiki bar on the edge of the small beach town.
			</div>
		</article>
	</body>
</html>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

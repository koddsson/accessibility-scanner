import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 4 (https://act-rules.github.io/testcases/de46e4/fd281d0b30ffe5442e38b6a109ab75c2a88ad21f.html)", async () => {
    await fixture(`<!DOCTYPE html> <html>
	<body>
		<article lang="english">
			<p aria-hidden="true">
				They wandered into a strange Tiki bar on the edge of the small beach town.
			</p>
		</article>
	</body>
</html>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

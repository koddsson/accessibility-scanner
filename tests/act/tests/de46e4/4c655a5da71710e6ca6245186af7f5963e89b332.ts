import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 5 (https://act-rules.github.io/testcases/de46e4/4c655a5da71710e6ca6245186af7f5963e89b332.html)", async () => {
    await fixture(`<!DOCTYPE html> <html>
	<body>
		<article lang="English">
			<p style="position: absolute; top: -9999px">
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

import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 2 (https://act-rules.github.io/testcases/de46e4/6eeab3c1580d2ee40e3adb6912c1ec159d6fbb26.html)", async () => {
    await fixture(`<!DOCTYPE html> <html>
	<body>
		<article lang="#!">
			They wandered into a strange Tiki bar on the edge of the small beach town.
		</article>
	</body>
</html>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

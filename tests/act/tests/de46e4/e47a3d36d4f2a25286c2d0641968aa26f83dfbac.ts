import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 3 (https://act-rules.github.io/testcases/de46e4/e47a3d36d4f2a25286c2d0641968aa26f83dfbac.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <html>
	<body>
		<article lang="  ">
			They wandered into a strange Tiki bar on the edge of the small beach town.
		</article>
	</body>
</html>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

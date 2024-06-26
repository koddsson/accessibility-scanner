import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Passed Example 1 (https://act-rules.github.io/testcases/de46e4/52b44481e1067806d435c1020422dc401c9a23b4.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html> <html>
	<body>
		<article lang="en">
			They wandered into a strange Tiki bar on the edge of the small beach town.
		</article>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

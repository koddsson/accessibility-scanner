import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Passed Example 5 (https://act-rules.github.io/testcases/de46e4/3bc716b9f3d4789c4a6aea4787d273b72a41d153.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <html>
	<body>
		<div lang="EN">
			<img src="/test-assets/shared/fireworks.jpg" alt="Fireworks over Paris" />
		</div>
	</body>
</html>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[de46e4]Element with lang attribute has valid language tag", function () {
  it("Failed Example 9 (https://act-rules.github.io/testcases/de46e4/a925c1aefbeec908d327431a48f5044bf16068a1.html)", async () => {
    await fixture(`<!DOCTYPE html> <html lang="lb">
	<body>
		<p lang="i-lux">Lëtzebuerg ass e Land an Europa.</p>
	</body>
</html>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 8 (https://act-rules.github.io/testcases/c487ae/a139aa4402ef782bf321751276333b10aafd8e26.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="https://www.w3.org/WAI" style="left: -9999px; position: absolute;">
	<img src="/test-assets/shared/w3c-logo.png" />
</a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

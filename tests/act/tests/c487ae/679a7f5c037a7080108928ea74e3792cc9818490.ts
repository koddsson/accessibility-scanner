import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 3 (https://act-rules.github.io/testcases/c487ae/679a7f5c037a7080108928ea74e3792cc9818490.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="http://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" role="presentation"/></a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

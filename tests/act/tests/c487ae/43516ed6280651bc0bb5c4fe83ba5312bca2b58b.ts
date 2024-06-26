import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 2 (https://act-rules.github.io/testcases/c487ae/43516ed6280651bc0bb5c4fe83ba5312bca2b58b.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" alt=""/></a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

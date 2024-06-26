import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 6 (https://act-rules.github.io/testcases/c487ae/a14f9d3d1d69e75cb990c1cb8951f2d70730e450.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" title="Web Accessibility Initiative"/></a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

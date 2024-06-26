import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 6 (https://act-rules.github.io/testcases/c487ae/e1c9b4f7702d04de31ba52d5af5c63dd6863804a.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" aria-labelledby="id1"/></a>
<div id="id1"></div>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

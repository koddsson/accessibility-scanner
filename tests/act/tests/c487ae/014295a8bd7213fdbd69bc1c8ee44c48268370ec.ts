import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 8 (https://act-rules.github.io/testcases/c487ae/014295a8bd7213fdbd69bc1c8ee44c48268370ec.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" aria-labelledby="id1"/></a>
<div id="id1">Web Accessibility Initiative (WAI)</div>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

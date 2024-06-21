import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 4 (https://act-rules.github.io/testcases/c487ae/d2e2cc0d8464668b150ed39373c350e5c35f59d2.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="http://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" role="none"/></a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

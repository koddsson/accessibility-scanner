import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 11 (https://act-rules.github.io/testcases/c487ae/9f56c77f4e790b52f176c5e2e582112af17ce658.html)", async () => {
    await fixture(`<!DOCTYPE html> See [<a href="https://act-rules.github.io/" role="doc-biblioref">ACT rules</a>]`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

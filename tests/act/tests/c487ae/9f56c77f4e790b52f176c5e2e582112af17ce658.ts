import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 11 (https://act-rules.github.io/testcases/c487ae/9f56c77f4e790b52f176c5e2e582112af17ce658.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> See [<a href="https://act-rules.github.io/" role="doc-biblioref">ACT rules</a>]`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

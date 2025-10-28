import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 11 (https://act-rules.github.io/testcases/c487ae/9f56c77f4e790b52f176c5e2e582112af17ce658.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html><html><head><title>Test</title></head><body>See [<a href="https://act-rules.github.io/" role="doc-biblioref">ACT rules</a>]</body></html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

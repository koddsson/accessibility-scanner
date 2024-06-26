import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 7 (https://act-rules.github.io/testcases/c487ae/2bdb0351ae2e82f05cfa15198ca0a353974f6278.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" aria-labelledby="id1"/></a>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

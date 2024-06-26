import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 11 (https://act-rules.github.io/testcases/c487ae/8b39de5e01179f2ca0b55e8aae65a18766530003.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> See [<a href="https://act-rules.github.io/" role="doc-biblioref"
	><img src="https://github.com/act-rules/act-rules.github.io/blob/develop/test-assets/shared/act-logo.png" alt=""/></a
>]`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

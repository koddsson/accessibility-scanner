import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 7 (https://act-rules.github.io/testcases/c487ae/2917b821f0e317de992cad191ed67aeedb9f34c9.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"
	><img src="/test-assets/shared/w3c-logo.png" alt="" />Web Accessibility Initiative (WAI)</a
>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

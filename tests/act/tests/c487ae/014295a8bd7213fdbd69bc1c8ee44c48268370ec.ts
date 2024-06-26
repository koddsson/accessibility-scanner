import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 8 (https://act-rules.github.io/testcases/c487ae/014295a8bd7213fdbd69bc1c8ee44c48268370ec.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"><img src="/test-assets/shared/w3c-logo.png" aria-labelledby="id1"/></a>
<div id="id1">Web Accessibility Initiative (WAI)</div>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 5 (https://act-rules.github.io/testcases/c487ae/03653844ceb8f6cd95af81672123ea98323ce5c8.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <a href="https://www.w3.org/WAI" title="Web Accessibility Initiative"
	><img src="/test-assets/shared/w3c-logo.png" alt=""
/></a>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

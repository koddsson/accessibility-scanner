import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 10 (https://act-rules.github.io/testcases/c487ae/8130b961773da8671837e6a633ca879d1edd28d0.html)", async () => {
    const el = parser.parseFromString(`<!DOCTYPE html> <a href="https://www.w3.org/WAI" role="none"> </a>`, 'text/html');

    const results = (await scan(el)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

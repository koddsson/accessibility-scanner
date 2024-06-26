import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 1 (https://act-rules.github.io/testcases/c487ae/113298e42bd5a240371affac3747a470c617610b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html> <a href="http://www.w3.org/WAI"></a>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

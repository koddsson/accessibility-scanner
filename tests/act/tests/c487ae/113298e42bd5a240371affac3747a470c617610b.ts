import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 1 (https://act-rules.github.io/testcases/c487ae/113298e42bd5a240371affac3747a470c617610b.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="http://www.w3.org/WAI"></a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

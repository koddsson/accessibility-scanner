import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 1 (https://act-rules.github.io/testcases/c487ae/34c82462f976ebaaa5f68fc0f3f519832614e182.html)", async () => {
    await fixture(`<!DOCTYPE html> <a href="https://www.w3.org/WAI"> Web Accessibility Initiative (WAI) </a>`);

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

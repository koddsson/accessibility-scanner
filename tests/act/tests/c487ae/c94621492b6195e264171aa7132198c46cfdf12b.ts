import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 3 (https://act-rules.github.io/testcases/c487ae/c94621492b6195e264171aa7132198c46cfdf12b.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html><html><head><title>Test</title></head><body><button role="link" onclick="window.location.href='https://www.w3.org/WAI/'">Click me for WAI!</button>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

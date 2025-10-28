import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Passed Example 4 (https://act-rules.github.io/testcases/c487ae/0d7a7862c5b414c272f1713c341d821f5249a15d.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html><html><head><title>Test</title></head><body><a href="https://www.w3.org/WAI"
	><img src="/test-assets/shared/w3c-logo.png" aria-label="Web Accessibility Initiative"
/></a>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

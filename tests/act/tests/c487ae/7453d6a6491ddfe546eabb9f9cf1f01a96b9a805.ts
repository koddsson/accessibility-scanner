import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[c487ae]Link has non-empty accessible name", function () {
  it("Failed Example 9 (https://act-rules.github.io/testcases/c487ae/7453d6a6491ddfe546eabb9f9cf1f01a96b9a805.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html><html><head><title>Test</title></head><body><img src="/test-assets/c487ae/planets.jpg" width="145" height="126" alt="Planets" usemap="#planetmap" />

<map name="planetmap">
	<area shape="rect" coords="0,0,82,126" href="sun.htm" />
</map>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.not.be.empty;
  });
});

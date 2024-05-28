import { expect } from "@open-wc/testing";
import { scan } from "../src/scanner";
import htmlHasLang from "../src/rules/html-has-lang";

describe("html-has-lang", function () {
  it("empty alt attribute fails", async () => {
    const container = document.createElement("html");

    const results = (await scan(container, [htmlHasLang])).map(
      ({ text, url }) => {
        return { text, url };
      },
    );

    expect(results).to.eql([
      {
        text: "<html> element must have a lang attribute",
        url: "https://dequeuniversity.com/rules/axe/4.4/html-has-lang",
      },
    ]);
  });
});

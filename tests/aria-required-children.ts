import { fixture, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import { ariaRequiredChildren } from "../src/rules/aria-required-children";

const scanner = new Scanner([ariaRequiredChildren]);

const passes = [];
const violations = [];

describe("aria-required-attr", async function () {
  // for (const markup of passes) {
  //   const el = await fixture(markup);
  //   it(el.outerHTML, async () => {
  //     const results = (await scanner.scan(el)).map(({ text, url }) => {
  //       return { text, url };
  //     });
  //     expect(results).to.be.empty;
  //   });
  // }
  // for (const markup of violations) {
  //   const el = await fixture(markup);
  //   it(el.outerHTML, async () => {
  //     const results = (await scanner.scan(el)).map(({ text, url }) => {
  //       return { text, url };
  //     });
  //     expect(results).to.eql([
  //       {
  //         text: "ARIA attributes must conform to valid names",
  //         url: "https://dequeuniversity.com/rules/axe/4.4/aria-valid-attr",
  //       },
  //     ]);
  //   });
  // }
});

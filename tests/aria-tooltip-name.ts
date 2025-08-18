// import { fixture, expect } from "@open-wc/testing";
// import { Scanner } from "../src/scanner";
// import { ariaTooltipName } from "../src/rules/aria-tooltip-name";
//
// const scanner = new Scanner([ariaTooltipName]);
//
// const passes = [
//   `<div role="tooltip" id="al" aria-label="Name"></div>`,
//   `<div>
//     <div role="tooltip" id="alb" aria-labelledby="labeldiv"></div>
//     <div id="labeldiv">Hello world!</div>
//   </div>`,
//   `<div role="tooltip" id="combo" aria-label="Aria Name">Name</div>`,
//   `<div role="tooltip" id="title" title="Title"></div>`,
// ];
//
// const violations = [
//   `<div role="tooltip" id="empty"></div>`,
//   `<div role="tooltip" id="alempty" aria-label=""></div>`,
//   `<div
//       role="tooltip"
//       id="albmissing"
//       aria-labelledby="nonexistent"
//     ></div>`,
//   `<div>
//     <div role="tooltip" id="albempty" aria-labelledby="emptydiv"></div>
//     <div id="emptydiv"></div>
//   </div>`,
// ];
//
// describe("aria-tooltip-name", async function () {
//   for (const markup of passes) {
//     const el = await fixture(markup);
//     it(el.outerHTML, async function () {
//       const results = (await scanner.scan(el)).map(({ text, url }) => {
//         return { text, url };
//       });
//
//       expect(results).to.be.empty;
//     });
//   }
//
//   for (const markup of violations) {
//     const el = await fixture(markup);
//     it(el.outerHTML, async function () {
//       const results = (await scanner.scan(el)).map(({ text, url }) => {
//         return { text, url };
//       });
//
//       expect(results).to.eql([
//         {
//           text: "ARIA tooltip must have an accessible name",
//           url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
//         },
//       ]);
//     });
//   }
// });

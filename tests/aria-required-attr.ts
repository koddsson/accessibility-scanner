// import { fixture, expect } from "@open-wc/testing";
// import { Scanner } from "../src/scanner";
// import ariaValidAttr from "../src/rules/aria-valid-attr";
//
// const scanner = new Scanner([ariaValidAttr]);
//
// // TODO
// const passes = [
//   // '<div id="target" role="switch" tabindex="1" aria-checked="false">',
//   // '<div id="target"></div>',
//   // '<input id="target" type="range" role="slider">',
//   // '<input id="target" type="checkbox" role="switch">',
//   // '<div id="target" role="separator"></div>',
//   // '<div id="target" role="combobox" aria-expanded="false"></div>',
//   // '<div id="target" role="combobox" aria-expanded="true" aria-controls="test"></div>',
// ];
// const violations = [
//   // '<div id="target" role="switch" tabindex="1">',
//   // '<div id="target" role="switch" tabindex="1" aria-checked>',
//   // '<div id="target" role="switch" tabindex="1" aria-checked="">',
//   // '<div id="target" role="separator" tabindex="0"></div>',
//   // '<div id="target" role="combobox" aria-expanded="invalid-value"></div>',
//   // '<div id="target" role="combobox" aria-expanded="true" aria-owns="ownedchild"></div>',
//   // '<div id="target" role="combobox"></div>',
//   // '<div id="target" role="combobox" aria-expanded="true"></div>',
// ];
//
// describe.skip("aria-required-attr", async function () {
//   for (const markup of passes) {
//     const el = await fixture(markup);
//     it(el.outerHTML, async () => {
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
//     it(el.outerHTML, async () => {
//       const results = (await scanner.scan(el)).map(({ text, url }) => {
//         return { text, url };
//       });
//
//       expect(results).to.eql([
//         {
//           text: "ARIA attributes must conform to valid names",
//           url: "https://dequeuniversity.com/rules/axe/4.4/aria-valid-attr",
//         },
//       ]);
//     });
//   }
// });
//

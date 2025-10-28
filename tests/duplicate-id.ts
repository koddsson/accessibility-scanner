import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import duplicateId from "../src/rules/duplicate-id";

const scanner = new Scanner([duplicateId]);

const passes = [
  await fixture(html`<div id="foo"></div>`),
  await fixture(html`<div><div id="foo"></div><span id="bar"></span></div>`),
  await fixture(html`<div><button id="btn1"></button><button id="btn2"></button></div>`),
  await fixture(html`<div id="unique1"><span id="unique2"></span></div>`),
  await fixture(html`<div><div></div><span></span></div>`), // No IDs
  await fixture(html`<div id="test"><div></div></div>`), // Only one ID
];

const violations = [
  await fixture(html`<div><div id="foo"></div><span id="foo"></span></div>`),
  await fixture(html`<div><button id="foo"></button><div id="foo"></div></div>`),
  await fixture(html`<div><div id="foo"></div><div id="foo"></div><span id="foo"></span></div>`),
  await fixture(html`<div><div id="test"></div><span id="test"></span></div>`),
  await fixture(html`<div><div id="duplicate"></div><button id="duplicate"></button></div>`),
];

describe("duplicate-id", function () {
  describe("passes when", function () {
    for (const el of passes) {
      it(el.outerHTML, async () => {
        const results = (await scanner.scan(el)).map(({ text, url }) => {
          return { text, url };
        });

        expect(results).to.be.empty;
      });
    }
  });

  describe("fails when", function () {
    it("there are two elements with the same id", async () => {
      const el = await fixture(html`<div><div id="foo"></div><span id="foo"></span></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
      ]);
    });

    it("there are three elements with the same id", async () => {
      const el = await fixture(html`<div><div id="foo"></div><div id="foo"></div><span id="foo"></span></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
      ]);
    });

    for (const el of violations) {
      it(el.outerHTML, async () => {
        const results = (await scanner.scan(el)).map(({ text, url }) => {
          return { text, url };
        });

        expect(results.length).to.be.greaterThan(0);
        for (const result of results) {
          expect(result).to.eql({
            text: "IDs must be unique",
            url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
          });
        }
      });
    }
  });

  describe("edge cases", function () {
    it("ignores empty id attributes", async () => {
      const el = await fixture(html`<div><div id=""></div><span id=""></span></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("ignores whitespace-only id attributes", async () => {
      const el = await fixture(html`<div><div id="   "></div><span id="  "></span></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("detects duplicates in nested elements", async () => {
      const el = await fixture(html`<div><div><div id="nested"></div></div><div><span id="nested"></span></div></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
        {
          text: "IDs must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id",
        },
      ]);
    });
  });
});

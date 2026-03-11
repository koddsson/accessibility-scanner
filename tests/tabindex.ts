import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import tabindex from "../src/rules/tabindex";

const scanner = new Scanner([tabindex]);

describe("tabindex", function () {
  describe("does not return errors if", function () {
    it("element has tabindex=0", async () => {
      const element = await fixture(html`
        <div>
          <button tabindex="0">Button</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("element has tabindex=-1", async () => {
      const element = await fixture(html`
        <div>
          <button tabindex="-1">Button</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("element has no tabindex", async () => {
      const element = await fixture(html`
        <div>
          <button>Button</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });

  describe("returns errors if", function () {
    it("element has tabindex=1", async () => {
      const element = await fixture(html`
        <div>
          <button tabindex="1">Button</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.eql({
        text: "Elements should not have tabindex greater than zero",
        url: "https://dequeuniversity.com/rules/axe/4.11/tabindex",
      });
    });

    it("element has tabindex=5", async () => {
      const element = await fixture(html`
        <div>
          <input tabindex="5" />
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.eql({
        text: "Elements should not have tabindex greater than zero",
        url: "https://dequeuniversity.com/rules/axe/4.11/tabindex",
      });
    });

    it("multiple elements have tabindex greater than zero", async () => {
      const element = await fixture(html`
        <div>
          <button tabindex="1">Button 1</button>
          <button tabindex="2">Button 2</button>
          <button tabindex="3">Button 3</button>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(3);
    });
  });
});

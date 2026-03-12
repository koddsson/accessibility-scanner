import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import validLang from "../src/rules/valid-lang";

const scanner = new Scanner([validLang]);

describe("valid-lang", function () {
  describe("has no errors if", function () {
    it("the lang attribute has a valid value", async () => {
      const container = await fixture(
        html`<p lang="en">Hello world</p>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("no lang attribute is present", async () => {
      const container = await fixture(html`<p>Hello world</p>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("a valid lang attribute is present with a region subtag", async () => {
      const container = await fixture(
        html`<p lang="en-US">Hello world</p>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("the lang attribute has an invalid value", async () => {
      const container = await fixture(
        html`<p lang="xyz">Hello world</p>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "Ensures lang attributes have valid values",
          url: "https://act-rules.github.io/rules/de46e4",
        },
      ]);
    });

    it("the lang attribute is empty with text content", async () => {
      const container = await fixture(
        html`<p lang="">Hello world</p>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "Ensures lang attributes have valid values",
          url: "https://act-rules.github.io/rules/de46e4",
        },
      ]);
    });

    it("includes id in errors", async () => {
      const container = await fixture(
        html`<p lang="invalid">Hello world</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "de46e4");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });
  });
});

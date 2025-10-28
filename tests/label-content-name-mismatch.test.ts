import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import labelContentNameMismatch from "../src/rules/label-content-name-mismatch";

const scanner = new Scanner([labelContentNameMismatch]);

describe("label-content-name-mismatch", function () {
  describe("has errors if", function () {
    it("aria-label does not contain visible text", async () => {
      const container = await fixture(
        html`<a href="https://act-rules.github.io/" aria-label="WCAG"
          >ACT rules</a
        >`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.include("visible text as part");
      expect(results[0].url).to.include("label-content-name-mismatch");
    });

    it("aria-label partially contains visible text but not as substring", async () => {
      const container = await fixture(
        html`<button aria-label="the full">The full label</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("similar but not exact match", async () => {
      const container = await fixture(
        html`<a href="#" aria-label="non-standard">nonstandard</a>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });
  });

  describe("has no errors if", function () {
    it("aria-label exactly matches visible text", async () => {
      const container = await fixture(
        html`<a href="https://act-rules.github.io/" aria-label="ACT rules"
          >ACT rules</a
        >`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("aria-label is case-insensitive match", async () => {
      const container = await fixture(
        html`<a href="https://act-rules.github.io/" aria-label="act rules"
          >ACT rules</a
        >`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("aria-label contains visible text as part of longer string", async () => {
      const container = await fixture(
        html`<button aria-label="Next Page in the list">Next Page</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element without aria-label", async () => {
      const container = await fixture(
        html`<button>Click me</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element with aria-hidden='true'", async () => {
      const container = await fixture(
        html`<button aria-hidden="true" aria-label="WCAG">ACT rules</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });

  describe("aria-labelledby scenarios", function () {
    it("has errors if aria-labelledby text doesn't contain visible text", async () => {
      const container = await fixture(
        html`<div>
          <span id="label1">Search</span>
          <button aria-labelledby="label1">Find</button>
        </div>`,
      );
      const button = container.querySelector('button');
      const results = await scanner.scan(button);

      expect(results).to.have.lengthOf(1);
    });

    it("has no errors if aria-labelledby text contains visible text", async () => {
      const container = await fixture(
        html`<div>
          <span id="label2">Find items</span>
          <button aria-labelledby="label2">Find</button>
        </div>`,
      );
      const button = container.querySelector('button');
      const results = await scanner.scan(button);

      expect(results).to.be.empty;
    });
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import targetSize from "../src/rules/target-size";

const scanner = new Scanner([targetSize]);

describe("target-size", function () {
  describe("has errors if", function () {
    it("button is smaller than 24x24px", async () => {
      const container = await fixture(
        html`<button style="width: 20px; height: 20px;">Small</button>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure touch target have sufficient size and space",
          url: "https://dequeuniversity.com/rules/axe/4.4/target-size?application=RuleDescription",
        },
      ]);
    });

    it("link is smaller than 24x24px (block display)", async () => {
      const container = await fixture(
        html`<a
          href="#"
          style="display: block; width: 20px; height: 20px;"
        ></a>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure touch target have sufficient size and space",
          url: "https://dequeuniversity.com/rules/axe/4.4/target-size?application=RuleDescription",
        },
      ]);
    });

    it("detects multiple undersized targets", async () => {
      const container = await fixture(html`
        <div>
          <button style="width: 20px; height: 20px;">1</button>
          <button style="width: 18px; height: 18px;">2</button>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
    });
  });

  describe("has no errors if", function () {
    it("button meets minimum size (24x24px)", async () => {
      const container = await fixture(
        html`<button style="width: 24px; height: 24px;">OK</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("button exceeds minimum size", async () => {
      const container = await fixture(
        html`<button style="width: 44px; height: 44px;">Large</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("link is inline text (exempt from size requirement)", async () => {
      const container = await fixture(
        html`<p>
          This is a paragraph with an
          <a href="#" style="font-size: 14px;">inline link</a>
          that is smaller than 24px.
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("hidden elements are not checked", async () => {
      const container = await fixture(
        html`<button
          style="width: 10px; height: 10px; display: none;"
        >Hidden</button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("non-interactive elements are not checked", async () => {
      const container = await fixture(
        html`<div style="width: 10px; height: 10px;">Not interactive</div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});

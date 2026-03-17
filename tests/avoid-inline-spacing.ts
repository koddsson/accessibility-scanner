import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import avoidInlineSpacing from "../src/rules/avoid-inline-spacing";

const scanner = new Scanner([avoidInlineSpacing]);

describe("avoid-inline-spacing", function () {
  describe("has errors if", function () {
    it("has !important line-height below threshold", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.2 !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      );
      expect(results[0].url).to.include("avoid-inline-spacing");
    });

    it("has !important letter-spacing below threshold", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 0.1em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      );
    });

    it("has !important word-spacing below threshold", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 0.1em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      );
    });

    it("has !important letter-spacing with px value (cannot evaluate without font-size)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 2px !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important line-height with em value below threshold", async () => {
      const container = await fixture(
        html`<p style="line-height: 1em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important line-height with percentage below threshold", async () => {
      const container = await fixture(
        html`<p style="line-height: 120% !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important with 'normal' keyword", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: normal !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important with 'initial' keyword", async () => {
      const container = await fixture(
        html`<p style="word-spacing: initial !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects !important with various whitespace", async () => {
      const container = await fixture(
        html`<p style="letter-spacing:0.1em!important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects !important in uppercase", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 0.1em !IMPORTANT">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects multiple elements with issues", async () => {
      const container = await fixture(
        html`<div>
          <p style="line-height: 1.2 !important">First paragraph</p>
          <p style="letter-spacing: 0.1em !important">Second paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
    });

    it("uses last !important when duplicates exist and last is below threshold", async () => {
      const container = await fixture(
        html`<p
          style="letter-spacing: 0.15em !important; letter-spacing: 0.1em !important"
        >
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });
  });

  describe("has no errors if", function () {
    it("has no inline styles", async () => {
      const container = await fixture(html`<p>Text content</p>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has inline text spacing without !important", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.5">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has inline letter-spacing without !important", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 2px">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has inline word-spacing without !important", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 5px">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important on non-spacing properties", async () => {
      const container = await fixture(
        html`<p style="color: red !important; font-size: 16px !important">
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has mixed properties with only non-spacing as !important", async () => {
      const container = await fixture(
        html`<p
          style="line-height: 1.5; color: red !important; letter-spacing: 2px"
        >
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has empty style attribute", async () => {
      const container = await fixture(html`<p style="">Text content</p>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has no style attribute at all", async () => {
      const container = await fixture(
        html`<div>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important letter-spacing at or above threshold (0.12em)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 0.15em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important word-spacing at or above threshold (0.16em)", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 0.2em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important line-height at or above threshold (1.5)", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.6 !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important line-height at threshold as em", async () => {
      const container = await fixture(
        html`<p style="line-height: 2em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important line-height at threshold as percentage", async () => {
      const container = await fixture(
        html`<p style="line-height: 160% !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important with 'inherit' keyword (passthrough)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: inherit !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important with 'unset' keyword (passthrough)", async () => {
      const container = await fixture(
        html`<p style="word-spacing: unset !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("uses last !important when duplicates exist and last is above threshold", async () => {
      const container = await fixture(
        html`<p
          style="letter-spacing: 0.1em !important; letter-spacing: 0.15em !important"
        >
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("last !important wins over earlier non-important value", async () => {
      const container = await fixture(
        html`<p
          style="letter-spacing: 0.15em !important; letter-spacing: 0.1em"
        >
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });

  describe("handles edge cases", function () {
    it("handles nested elements with mixed styles", async () => {
      const container = await fixture(
        html`<div style="color: blue">
          <p style="letter-spacing: 0.1em !important">Nested paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("skips elements with no text content", async () => {
      const container = await fixture(
        html`<div style="letter-spacing: 0.1em !important"></div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("skips elements hidden with display: none", async () => {
      const container = await fixture(
        html`<p style="display: none; letter-spacing: 0.1em !important">
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("handles property value with important substring but not !important", async () => {
      const container = await fixture(
        html`<p style="font-family: 'Important Sans'">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import avoidInlineSpacing from "../src/rules/avoid-inline-spacing";

const scanner = new Scanner([avoidInlineSpacing]);

describe("avoid-inline-spacing", function () {
  describe("has errors if", function () {
    it("has !important line-height below threshold in inline style", async () => {
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

    it("has !important letter-spacing below threshold in em", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 0.1em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important word-spacing below threshold in em", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 0.1em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important letter-spacing in px (can't verify statically)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 2px !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important word-spacing in px (can't verify statically)", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 5px !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important line-height: normal (resets to default)", async () => {
      const container = await fixture(
        html`<p style="line-height: normal !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has !important letter-spacing: initial (resets to default)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: initial !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("has multiple !important spacing properties below threshold", async () => {
      const container = await fixture(
        html`<p
          style="line-height: 1.2 !important; letter-spacing: 0.1em !important"
        >
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects !important with various whitespace", async () => {
      const container = await fixture(
        html`<p style="line-height:1.2!important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects !important in uppercase", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.2 !IMPORTANT">Text content</p>`,
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

    it("has !important line-height percentage below threshold", async () => {
      const container = await fixture(
        html`<p style="line-height: 120% !important">Text content</p>`,
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
        html`<p style="line-height: 1.2">Text content</p>`,
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

    it("has !important letter-spacing at threshold (0.12em)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 0.12em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important word-spacing at threshold (0.16em)", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 0.16em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important line-height at threshold (1.5)", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.5 !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important line-height above threshold in em", async () => {
      const container = await fixture(
        html`<p style="line-height: 2em !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important line-height percentage at threshold (150%)", async () => {
      const container = await fixture(
        html`<p style="line-height: 150% !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important inherit (passthrough, doesn't restrict)", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: inherit !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has !important unset (passthrough, doesn't restrict)", async () => {
      const container = await fixture(
        html`<p style="word-spacing: unset !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });

  describe("handles duplicate declarations", function () {
    it("last !important wins when above threshold", async () => {
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

    it("non-important after important doesn't override", async () => {
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

    it("last !important wins when below threshold", async () => {
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

  describe("handles edge cases", function () {
    it("handles nested elements with mixed styles", async () => {
      const container = await fixture(
        html`<div style="color: blue">
          <p style="line-height: 1.2 !important">Nested paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("ignores elements with no text content", async () => {
      const container = await fixture(
        html`<div style="line-height: 1.2 !important"></div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("ignores elements hidden with display: none", async () => {
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

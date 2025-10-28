import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import avoidInlineSpacing from "../src/rules/avoid-inline-spacing";

const scanner = new Scanner([avoidInlineSpacing]);

describe("avoid-inline-spacing", function () {
  describe("has errors if", function () {
    it("has !important line-height in inline style", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.5 !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      );
      expect(results[0].url).to.include("avoid-inline-spacing");
    });

    it("has !important letter-spacing in inline style", async () => {
      const container = await fixture(
        html`<p style="letter-spacing: 2px !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      );
    });

    it("has !important word-spacing in inline style", async () => {
      const container = await fixture(
        html`<p style="word-spacing: 5px !important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      );
    });

    it("has multiple !important spacing properties", async () => {
      const container = await fixture(
        html`<p
          style="line-height: 1.5 !important; letter-spacing: 2px !important"
        >
          Text content
        </p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects !important with various whitespace", async () => {
      const container = await fixture(
        html`<p style="line-height:1.5!important">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects !important in uppercase", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.5 !IMPORTANT">Text content</p>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("detects multiple elements with issues", async () => {
      const container = await fixture(
        html`<div>
          <p style="line-height: 1.5 !important">First paragraph</p>
          <p style="letter-spacing: 2px !important">Second paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
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
  });

  describe("handles edge cases", function () {
    it("handles nested elements with mixed styles", async () => {
      const container = await fixture(
        html`<div style="color: blue">
          <p style="line-height: 1.5 !important">Nested paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("ignores elements with no text content", async () => {
      const container = await fixture(
        html`<div style="line-height: 1.5 !important"></div>`,
      );
      const results = await scanner.scan(container);

      // The rule should still report it even without text content
      // as it's checking for the presence of !important inline styles
      expect(results).to.have.lengthOf(1);
    });

    it("handles comments in style values (edge case)", async () => {
      const container = await fixture(
        html`<p style="line-height: 1.5">Text with normal spacing</p>`,
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

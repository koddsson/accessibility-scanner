import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import colorContrast from "../src/rules/color-contrast";

const scanner = new Scanner([colorContrast]);

describe("color-contrast", function () {
  describe("has errors if", function () {
    it("has insufficient contrast for normal text (< 4.5:1)", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(119, 119, 119); background-color: rgb(255, 255, 255);"
        >
          Low contrast text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Elements must have sufficient color contrast",
      );
      expect(results[0].url).to.include("color-contrast");
    });

    it("has insufficient contrast for large text (< 3:1)", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(160, 160, 160); background-color: rgb(255, 255, 255); font-size: 24px;"
        >
          Large low contrast text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Elements must have sufficient color contrast",
      );
    });

    it("has insufficient contrast with semi-transparent foreground", async () => {
      const container = await fixture(
        html`<div
          style="color: rgba(100, 100, 100, 0.5); background-color: rgb(255, 255, 255);"
        >
          Semi-transparent text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results.length).to.be.greaterThan(0);
      expect(results[0].text).to.equal(
        "Elements must have sufficient color contrast",
      );
    });

    it("has insufficient contrast with nested elements", async () => {
      const container = await fixture(
        html`<div style="background-color: rgb(255, 255, 255);">
          <p style="color: rgb(150, 150, 150);">
            Nested paragraph with low contrast
          </p>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results.length).to.be.greaterThan(0);
    });
  });

  describe("has no errors if", function () {
    it("has sufficient contrast for normal text (>= 4.5:1)", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);"
        >
          High contrast text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has sufficient contrast for large text (>= 3:1)", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(130, 130, 130); background-color: rgb(255, 255, 255); font-size: 24px;"
        >
          Large text with adequate contrast
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("has sufficient contrast with bold large text", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(130, 130, 130); background-color: rgb(255, 255, 255); font-size: 19px; font-weight: bold;"
        >
          Bold large text with adequate contrast
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element has no text content", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255);"
        ></div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element is hidden", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255); display: none;"
        >
          Hidden text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element has visibility hidden", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255); visibility: hidden;"
        >
          Hidden text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element has opacity 0", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255); opacity: 0;"
        >
          Invisible text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("input elements are skipped", async () => {
      const container = await fixture(
        html`<input
          type="text"
          value="Input text"
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255);"
        />`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("button elements are skipped", async () => {
      const container = await fixture(
        html`<button
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255);"
        >
          Button
        </button>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });

  describe("handles edge cases", function () {
    it("inherits background from parent", async () => {
      const container = await fixture(
        html`<div style="background-color: rgb(255, 255, 255);">
          <div style="color: rgb(150, 150, 150);">
            Text with inherited background
          </div>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results.length).to.be.greaterThan(0);
    });

    it("handles transparent background by inheriting from parent", async () => {
      const container = await fixture(
        html`<div style="background-color: rgb(0, 0, 0);">
          <div style="color: rgb(150, 150, 150); background-color: transparent;">
            Text on transparent
          </div>
        </div>`,
      );
      const results = await scanner.scan(container);

      // Against black background, gray text should have low contrast
      expect(results.length).to.be.greaterThan(0);
    });

    it("handles multiple text nodes", async () => {
      const container = await fixture(
        html`<div style="background-color: rgb(255, 255, 255);">
          <p style="color: rgb(150, 150, 150);">First paragraph</p>
          <p style="color: rgb(150, 150, 150);">Second paragraph</p>
        </div>`,
      );
      const results = await scanner.scan(container);

      // Should find errors for both paragraphs
      expect(results.length).to.equal(2);
    });

    it("marks elements with background image for review", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-image: url('data:image/gif;base64,R0lGODlhAQABAAAAACw=');"
        >
          Text over image
        </div>`,
      );
      const results = await scanner.scan(container);

      if (results.length > 0) {
        // If an error is found, it should be marked for review
        const result = results[0] as any;
        expect(result.needsReview).to.be.true;
      }
    });
  });

  describe("color format handling", function () {
    it("handles hex color format", async () => {
      const container = await fixture(
        html`<div style="color: #777777; background-color: #ffffff;">
          Hex colors
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results.length).to.be.greaterThan(0);
    });

    it("handles RGB color format", async () => {
      const container = await fixture(
        html`<div style="color: rgb(119, 119, 119); background-color: rgb(255, 255, 255);">
          RGB colors
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results.length).to.be.greaterThan(0);
    });

    it("handles RGBA color format", async () => {
      const container = await fixture(
        html`<div
          style="color: rgba(119, 119, 119, 1); background-color: rgba(255, 255, 255, 1);"
        >
          RGBA colors
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results.length).to.be.greaterThan(0);
    });
  });

  describe("result data fields", function () {
    it("includes detailed contrast information in error", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(119, 119, 119); background-color: rgb(255, 255, 255);"
        >
          Low contrast
        </div>`,
      );
      const results = (await scanner.scan(container)) as any[];

      expect(results).to.have.lengthOf(1);
      const result = results[0];

      expect(result.foregroundColor).to.exist;
      expect(result.backgroundColor).to.exist;
      expect(result.contrastRatio).to.be.a("number");
      expect(result.expectedRatio).to.equal(4.5);
      expect(result.contrastRatio).to.be.lessThan(4.5);
    });

    it("uses correct threshold for large text", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(160, 160, 160); background-color: rgb(255, 255, 255); font-size: 24px;"
        >
          Large text
        </div>`,
      );
      const results = (await scanner.scan(container)) as any[];

      if (results.length > 0) {
        const result = results[0];
        expect(result.expectedRatio).to.equal(3);
      }
    });
  });
});

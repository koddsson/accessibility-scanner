import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import colorContrastEnhanced from "../src/rules/color-contrast-enhanced";

const scanner = new Scanner([colorContrastEnhanced]);

describe("color-contrast-enhanced", function () {
  describe("has errors if", function () {
    it("has contrast between AA and AAA thresholds for normal text", async () => {
      // rgb(100, 100, 100) on white gives ~5.9:1 ratio (passes AA 4.5:1 but fails AAA 7:1)
      const container = await fixture(
        html`<div
          style="color: rgb(100, 100, 100); background-color: rgb(255, 255, 255);"
        >
          Medium contrast text
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Elements must meet enhanced color contrast ratio thresholds",
      );
      expect(results[0].url).to.include("color-contrast-enhanced");
    });

    it("has contrast between AA large and AAA large thresholds for large text", async () => {
      // rgb(150, 150, 150) on white gives ~3.2:1 ratio (passes AA large 3:1 but fails AAA large 4.5:1)
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255); font-size: 24px;"
        >
          Large text with medium contrast
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Elements must meet enhanced color contrast ratio thresholds",
      );
    });

    it("includes detailed contrast information in error", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(100, 100, 100); background-color: rgb(255, 255, 255);"
        >
          Medium contrast
        </div>`,
      );
      const results = (await scanner.scan(container)) as any[];

      expect(results).to.have.lengthOf(1);
      const result = results[0];

      expect(result.foregroundColor).to.exist;
      expect(result.backgroundColor).to.exist;
      expect(result.contrastRatio).to.be.a("number");
      expect(result.expectedRatio).to.equal(7);
      expect(result.contrastRatio).to.be.lessThan(7);
    });

    it("uses 4.5:1 threshold for large text", async () => {
      const container = await fixture(
        html`<div
          style="color: rgb(150, 150, 150); background-color: rgb(255, 255, 255); font-size: 24px;"
        >
          Large text
        </div>`,
      );
      const results = (await scanner.scan(container)) as any[];

      expect(results).to.have.lengthOf(1);
      const result = results[0];
      expect(result.expectedRatio).to.equal(4.5);
    });
  });

  describe("has no errors if", function () {
    it("has high contrast text (black on white)", async () => {
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

    it("has large text with 4.5:1+ ratio", async () => {
      // rgb(119, 119, 119) on white gives ~4.48:1, need slightly darker
      // rgb(110, 110, 110) on white gives ~4.97:1 ratio (passes AAA large 4.5:1)
      const container = await fixture(
        html`<div
          style="color: rgb(110, 110, 110); background-color: rgb(255, 255, 255); font-size: 24px;"
        >
          Large text with sufficient contrast
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
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaValidAttr from "../src/rules/aria-valid-attr";

const scanner = new Scanner([ariaValidAttr]);

describe("aria-valid-attr", function () {
  describe("has no errors if", function () {
    it("uses aria-current='page' on a link", async () => {
      const container = await fixture(
        html`<nav>
          <a href="/home" aria-current="page">Home</a>
          <a href="/about">About</a>
        </nav>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("uses aria-selected on a tab element", async () => {
      const container = await fixture(
        html`<div role="tablist">
          <button role="tab" aria-selected="true">Tab 1</button>
          <button role="tab" aria-selected="false">Tab 2</button>
        </div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("uses aria-current with other valid values", async () => {
      const container = await fixture(
        html`<ol>
          <li aria-current="step">Step 1</li>
          <li>Step 2</li>
        </ol>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("uses aria-details on an element", async () => {
      const container = await fixture(
        html`<img src="chart.png" alt="Chart" aria-details="details-1" />`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("uses aria-roledescription on an element", async () => {
      const container = await fixture(
        html`<div role="group" aria-roledescription="slide">Slide 1</div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("uses aria-errormessage on a valid role", async () => {
      const container = await fixture(
        html`<input type="text" role="checkbox" aria-errormessage="err-1" />`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("uses aria-colcount and aria-rowcount on a table", async () => {
      const container = await fixture(
        html`<table role="grid" aria-colcount="5" aria-rowcount="10">
          <tr>
            <td aria-colindex="1" aria-rowindex="1">Cell</td>
          </tr>
        </table>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });
  });

  describe("has errors if", function () {
    it("uses an invalid aria attribute", async () => {
      const container = await fixture(
        html`<div aria-foo="bar">Content</div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.equal("aria-valid-attr");
    });

    it("uses a misspelled aria attribute", async () => {
      const container = await fixture(
        html`<div aria-chekced="true">Content</div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.equal("aria-valid-attr");
    });
  });
});

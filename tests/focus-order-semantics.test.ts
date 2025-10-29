import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import focusOrderSemantics from "../src/rules/focus-order-semantics";

const scanner = new Scanner([focusOrderSemantics]);

describe("focus-order-semantics", function () {
  describe("has errors if", function () {
    it("div with tabindex='0' has no role", async () => {
      const container = await fixture(html`<div tabindex="0">Focusable div</div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Ensures elements in the focus order have a role appropriate for interactive content",
      );
      expect(results[0].url).to.include("focus-order-semantics");
    });

    it("span with tabindex='0' has no role", async () => {
      const container = await fixture(html`<span tabindex="0">Focusable span</span>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.include(
        "elements in the focus order have a role appropriate",
      );
    });

    it("div with tabindex='1' and no role", async () => {
      const container = await fixture(html`<div tabindex="1">Focusable div with positive tabindex</div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("element with tabindex='0' and non-interactive role", async () => {
      const container = await fixture(html`<div tabindex="0" role="article">Article</div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("element with tabindex='0' and generic role", async () => {
      const container = await fixture(html`<div tabindex="0" role="none">Content</div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("multiple elements with tabindex but no appropriate role", async () => {
      const container = await fixture(
        html`<div>
          <div tabindex="0">First</div>
          <span tabindex="0">Second</span>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(2);
    });

    it("p element with tabindex='0' and no role", async () => {
      const container = await fixture(html`<p tabindex="0">Focusable paragraph</p>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });
  });

  describe("has no errors if", function () {
    it("div with tabindex='0' and button role", async () => {
      const container = await fixture(html`<div tabindex="0" role="button">Click me</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and link role", async () => {
      const container = await fixture(html`<div tabindex="0" role="link">Link</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and tab role", async () => {
      const container = await fixture(html`<div tabindex="0" role="tab">Tab</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and menuitem role", async () => {
      const container = await fixture(html`<div tabindex="0" role="menuitem">Menu Item</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and checkbox role", async () => {
      const container = await fixture(html`<div tabindex="0" role="checkbox">Checkbox</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and textbox role", async () => {
      const container = await fixture(html`<div tabindex="0" role="textbox">Text</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("native button element (no tabindex needed)", async () => {
      const container = await fixture(html`<button>Click me</button>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("native input element (no tabindex needed)", async () => {
      const container = await fixture(html`<input type="text" />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("native link with href (no tabindex needed)", async () => {
      const container = await fixture(html`<a href="#">Link</a>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("native select element", async () => {
      const container = await fixture(
        html`<select>
          <option>Option 1</option>
        </select>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("native textarea element", async () => {
      const container = await fixture(html`<textarea></textarea>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("element with tabindex='-1' (not in focus order)", async () => {
      const container = await fixture(html`<div tabindex="-1">Not in focus order</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("disabled button (not in focus order)", async () => {
      const container = await fixture(html`<button disabled>Disabled</button>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("disabled input (not in focus order)", async () => {
      const container = await fixture(html`<input type="text" disabled />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with no tabindex attribute", async () => {
      const container = await fixture(html`<div>Not focusable</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("anchor without href (not naturally focusable)", async () => {
      const container = await fixture(html`<a>Not a link</a>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("input type=button has implicit button role", async () => {
      const container = await fixture(html`<input type="button" value="Click" />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("input type=submit has implicit button role", async () => {
      const container = await fixture(html`<input type="submit" value="Submit" />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("input type=checkbox has implicit checkbox role", async () => {
      const container = await fixture(html`<input type="checkbox" />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("summary element has implicit button role", async () => {
      const container = await fixture(
        html`<details>
          <summary>Click to expand</summary>
        </details>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and slider role", async () => {
      const container = await fixture(html`<div tabindex="0" role="slider">Slider</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and spinbutton role", async () => {
      const container = await fixture(html`<div tabindex="0" role="spinbutton">Spin</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and switch role", async () => {
      const container = await fixture(html`<div tabindex="0" role="switch">Toggle</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and combobox role", async () => {
      const container = await fixture(html`<div tabindex="0" role="combobox">Combo</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("div with tabindex='0' and searchbox role", async () => {
      const container = await fixture(html`<div tabindex="0" role="searchbox">Search</div>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });

  describe("edge cases", function () {
    it("mixed: some elements with appropriate roles, some without", async () => {
      const container = await fixture(
        html`<div>
          <div tabindex="0" role="button">OK</div>
          <div tabindex="0">Bad</div>
          <button>Good</button>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0].element.textContent).to.include("Bad");
    });

    it("deeply nested elements with tabindex", async () => {
      const container = await fixture(
        html`<div>
          <div>
            <div>
              <span tabindex="0">Nested span</span>
            </div>
          </div>
        </div>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("tabindex with whitespace", async () => {
      const container = await fixture(html`<div tabindex=" 0 ">Content</div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
    });

    it("element is itself the scanned element with tabindex", async () => {
      const element = document.createElement("div");
      element.setAttribute("tabindex", "0");
      element.textContent = "Root element";
      document.body.appendChild(element);

      const results = await scanner.scan(element);
      expect(results).to.have.lengthOf(1);

      document.body.removeChild(element);
    });

    it("button with explicit role=button and tabindex", async () => {
      const container = await fixture(html`<button tabindex="0" role="button">Explicit</button>`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("input type=range has implicit slider role", async () => {
      const container = await fixture(html`<input type="range" min="0" max="100" />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("input type=number has implicit spinbutton role", async () => {
      const container = await fixture(html`<input type="number" />`);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});

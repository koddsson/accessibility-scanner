import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import errorMessage from "../src/rules/error-message";

const scanner = new Scanner([errorMessage]);

describe("error-message", function () {
  describe("has no errors if", function () {
    it("elements with ARIA widget roles inside a form are not flagged", async () => {
      const container = await fixture(
        html`<form>
          <ul role="tablist" id="myTabs">
            <li
              role="tab"
              id="tab-1"
              aria-controls="panel-1"
              aria-selected="true"
            >
              Tab 1
            </li>
            <li
              role="tab"
              id="tab-2"
              aria-controls="panel-2"
              aria-selected="false"
            >
              Tab 2
            </li>
          </ul>
          <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
            <input type="text" name="field1" />
          </div>
          <div role="tabpanel" id="panel-2" aria-labelledby="tab-2">
            <input type="text" name="field2" />
          </div>
          <button type="submit">Submit</button>
        </form>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("elements with menu roles inside a form are not flagged", async () => {
      const container = await fixture(
        html`<form>
          <ul role="menubar" id="nav">
            <li role="menuitem" id="item-1">Option 1</li>
            <li role="menuitem" id="item-2">Option 2</li>
          </ul>
          <input type="text" name="field" />
          <button type="submit">Submit</button>
        </form>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("elements with toolbar role inside a form are not flagged", async () => {
      const container = await fixture(
        html`<form>
          <div role="toolbar" id="editor-toolbar">Bold | Italic</div>
          <textarea name="content"></textarea>
          <button type="submit">Submit</button>
        </form>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("elements with landmark roles inside a form are not flagged", async () => {
      const container = await fixture(
        html`<form>
          <nav role="navigation" id="form-nav">Section links</nav>
          <input type="text" name="field" />
          <button type="submit">Submit</button>
        </form>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });
  });

  describe("still has errors if", function () {
    it("a non-widget element with id is not associated with a form field", async () => {
      const container = await fixture(
        html`<form>
          <input type="text" name="email" />
          <span id="email-error">Please enter a valid email</span>
          <button type="submit">Submit</button>
        </form>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.equal("error-message");
    });
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import duplicateIdActive from "../src/rules/duplicate-id-active";

const scanner = new Scanner([duplicateIdActive]);

describe("duplicate-id-active", function () {
  describe("has no errors if", function () {
    it("elements have unique IDs", async () => {
      const container = await fixture(html`
        <div>
          <button id="btn1">Button 1</button>
          <button id="btn2">Button 2</button>
          <a href="#" id="link1">Link 1</a>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("non-active elements have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <div id="foo">Div 1</div>
          <div id="foo">Div 2</div>
          <span id="bar">Span 1</span>
          <span id="bar">Span 2</span>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("active elements don't have IDs", async () => {
      const container = await fixture(html`
        <div>
          <button>Button 1</button>
          <button>Button 2</button>
          <a href="#">Link 1</a>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("only one active element has an ID", async () => {
      const container = await fixture(html`
        <div>
          <button id="unique">Button 1</button>
          <button>Button 2</button>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("elements with tabindex='-1' have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <div id="duplicate" tabindex="-1">Div 1</div>
          <div id="duplicate" tabindex="-1">Div 2</div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("two buttons have the same ID", async () => {
      const container = await fixture(html`
        <div>
          <button id="duplicate">Button 1</button>
          <button id="duplicate">Button 2</button>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results).to.eql([
        {
          text: "IDs of active elements must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id-active",
        },
        {
          text: "IDs of active elements must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id-active",
        },
      ]);
    });

    it("two links have the same ID", async () => {
      const container = await fixture(html`
        <div>
          <a href="#" id="link">Link 1</a>
          <a href="#" id="link">Link 2</a>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results).to.eql([
        {
          text: "IDs of active elements must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id-active",
        },
        {
          text: "IDs of active elements must be unique",
          url: "https://dequeuniversity.com/rules/axe/4.4/duplicate-id-active",
        },
      ]);
    });

    it("multiple input elements have the same ID", async () => {
      const container = await fixture(html`
        <div>
          <input type="text" id="field" />
          <input type="email" id="field" />
          <input type="number" id="field" />
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(3);
    });

    it("select elements have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <select id="select">
            <option>Option 1</option>
          </select>
          <select id="select">
            <option>Option 2</option>
          </select>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });

    it("textarea elements have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <textarea id="text"></textarea>
          <textarea id="text"></textarea>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });

    it("elements with positive tabindex have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <div id="focusable" tabindex="0">Div 1</div>
          <div id="focusable" tabindex="1">Div 2</div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });

    it("contenteditable elements have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <div id="editable" contenteditable="true">Edit 1</div>
          <div id="editable" contenteditable="">Edit 2</div>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });

    it("mixed active elements have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <button id="control">Button</button>
          <a href="#" id="control">Link</a>
          <input type="text" id="control" />
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(3);
    });

    it("summary elements have duplicate IDs", async () => {
      const container = await fixture(html`
        <div>
          <details>
            <summary id="summary">Summary 1</summary>
            <p>Details 1</p>
          </details>
          <details>
            <summary id="summary">Summary 2</summary>
            <p>Details 2</p>
          </details>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });
  });
});

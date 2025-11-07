import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import scrollableRegionFocusable from "../src/rules/scrollable-region-focusable";

const scanner = new Scanner([scrollableRegionFocusable]);

describe("scrollable-region-focusable", function () {
  describe("passes when", function () {
    it("element has no scrollable content", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px;">
          <p>Short content that doesn't overflow</p>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("scrollable element is focusable via tabindex", async () => {
      const el = await fixture(html`
        <div
          tabindex="0"
          style="width: 100px; height: 100px; overflow: auto;"
        >
          <p style="height: 200px;">
            Long content that overflows and requires scrolling
          </p>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("scrollable element contains a focusable link", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p style="height: 200px;">
            <a href="#content">Link inside scrollable region</a>
          </p>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("scrollable element contains a button", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p style="height: 200px;">Content</p>
          <button>Focusable button</button>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("scrollable element contains an input", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p style="height: 200px;">Content</p>
          <input type="text" />
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("element with overflow but no actual overflow", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p>Short content</p>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("element with overflow-y scroll and focusable descendant", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow-y: scroll;">
          <p style="height: 200px;">Content</p>
          <a href="#test">Link</a>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("element with overflow-x scroll and focusable descendant", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow-x: scroll;">
          <p style="width: 200px;">Wide content that overflows horizontally</p>
          <button>Button</button>
        </div>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("scrollable textarea (naturally focusable)", async () => {
      const el = await fixture(html`
        <textarea style="width: 100px; height: 50px; overflow: auto;">
This is a long text that will overflow
and require scrolling to read all content
        </textarea>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });

    it("scrollable select (naturally focusable)", async () => {
      const el = await fixture(html`
        <select size="2" style="height: 50px; overflow: auto;">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
          <option>Option 4</option>
        </select>
      `);

      const results = await scanner.scan(el);
      expect(results).to.be.empty;
    });
  });

  describe("fails when", function () {
    it("scrollable element is not focusable and has no focusable descendants", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p style="height: 200px;">
            Long content that overflows but has no way to be reached by keyboard
          </p>
        </div>
      `);

      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure elements that have scrollable content are accessible by keyboard",
          url: "https://dequeuniversity.com/rules/axe/4.4/scrollable-region-focusable",
        },
      ]);
    });

    it("scrollable element with negative tabindex", async () => {
      const el = await fixture(html`
        <div
          tabindex="-1"
          style="width: 100px; height: 100px; overflow: auto;"
        >
          <p style="height: 200px;">
            Content with negative tabindex cannot be reached via sequential keyboard navigation
          </p>
        </div>
      `);

      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure elements that have scrollable content are accessible by keyboard",
          url: "https://dequeuniversity.com/rules/axe/4.4/scrollable-region-focusable",
        },
      ]);
    });

    it("scrollable element with overflow-y scroll", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow-y: scroll;">
          <p style="height: 200px;">
            Overflowing content without keyboard accessibility
          </p>
        </div>
      `);

      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure elements that have scrollable content are accessible by keyboard",
          url: "https://dequeuniversity.com/rules/axe/4.4/scrollable-region-focusable",
        },
      ]);
    });

    it("scrollable element with disabled button descendant", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p style="height: 200px;">Content</p>
          <button disabled>Disabled button doesn't count</button>
        </div>
      `);

      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure elements that have scrollable content are accessible by keyboard",
          url: "https://dequeuniversity.com/rules/axe/4.4/scrollable-region-focusable",
        },
      ]);
    });

    it("scrollable element with anchor without href", async () => {
      const el = await fixture(html`
        <div style="width: 100px; height: 100px; overflow: auto;">
          <p style="height: 200px;">Content</p>
          <a>Anchor without href is not focusable</a>
        </div>
      `);

      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensure elements that have scrollable content are accessible by keyboard",
          url: "https://dequeuniversity.com/rules/axe/4.4/scrollable-region-focusable",
        },
      ]);
    });
  });
});

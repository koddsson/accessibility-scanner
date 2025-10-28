import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import listitem from "../src/rules/listitem";

const scanner = new Scanner([listitem]);

describe("listitem", function () {
  describe("has errors if", function () {
    it("<li> element is not contained in a list", async () => {
      const container = await fixture(html`
        <div>
          <li>Invalid list item</li>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <li> elements are used semantically",
          url: "https://dequeuniversity.com/rules/axe/4.4/listitem?application=RuleDescription",
        },
      ]);
    });

    it("<li> element is directly in body", async () => {
      const container = await fixture(html`<li>Orphan list item</li>`);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <li> elements are used semantically",
          url: "https://dequeuniversity.com/rules/axe/4.4/listitem?application=RuleDescription",
        },
      ]);
    });

    it("element with role='listitem' is not contained in a list", async () => {
      const container = await fixture(html`
        <div>
          <div role="listitem">Invalid list item</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <li> elements are used semantically",
          url: "https://dequeuniversity.com/rules/axe/4.4/listitem?application=RuleDescription",
        },
      ]);
    });

    it("multiple <li> elements without proper parents", async () => {
      const container = await fixture(html`
        <div>
          <li>First invalid item</li>
          <li>Second invalid item</li>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <li> elements are used semantically",
          url: "https://dequeuniversity.com/rules/axe/4.4/listitem?application=RuleDescription",
        },
        {
          text: "Ensures <li> elements are used semantically",
          url: "https://dequeuniversity.com/rules/axe/4.4/listitem?application=RuleDescription",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("<li> elements are inside <ul>", async () => {
      const container = await fixture(html`
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<li> elements are inside <ol>", async () => {
      const container = await fixture(html`
        <ol>
          <li>First</li>
          <li>Second</li>
          <li>Third</li>
        </ol>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("elements with role='listitem' are inside element with role='list'", async () => {
      const container = await fixture(html`
        <div role="list">
          <div role="listitem">Item 1</div>
          <div role="listitem">Item 2</div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<li> elements are inside nested lists", async () => {
      const container = await fixture(html`
        <ul>
          <li>
            Item 1
            <ul>
              <li>Nested item 1</li>
              <li>Nested item 2</li>
            </ul>
          </li>
          <li>Item 2</li>
        </ul>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<li> elements inside <ul> with other valid children", async () => {
      const container = await fixture(html`
        <ul>
          <li>Item 1</li>
          <script>
            // Script tag is allowed
          </script>
          <li>Item 2</li>
          <template>
            <li>Template content</li>
          </template>
        </ul>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("<li> elements inside role='list' with wrapper divs", async () => {
      const container = await fixture(html`
        <div role="list">
          <div>
            <div role="listitem">Deeply nested item</div>
          </div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("mixed semantic and ARIA list structures", async () => {
      const container = await fixture(html`
        <div>
          <ul>
            <li>Semantic list item</li>
          </ul>
          <div role="list">
            <div role="listitem">ARIA list item</div>
          </div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});

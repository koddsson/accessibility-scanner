import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import bypass from "../src/rules/bypass";

const scanner = new Scanner([bypass]);

describe("bypass", function () {
  describe("has no errors if", function () {
    it("page has a skip link", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <a href="#main">Skip to main content</a>
            <nav>
              <a href="/home">Home</a>
              <a href="/about">About</a>
            </nav>
            <main id="main">
              <h1>Main Content</h1>
              <p>Content goes here</p>
            </main>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });

    it("page has ARIA main landmark", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <nav>
              <a href="/home">Home</a>
            </nav>
            <main>
              <h1>Main Content</h1>
            </main>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });

    it("page has role=main landmark", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <nav>Navigation</nav>
            <div role="main">
              <h1>Main Content</h1>
            </div>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });

    it("page has navigation landmark with main landmark", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <nav>
              <a href="/home">Home</a>
            </nav>
            <main>
              <h1>Content</h1>
            </main>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });

    it("page has role=navigation landmark with main landmark", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <div role="navigation">
              <a href="/home">Home</a>
            </div>
            <main>
              <h1>Content</h1>
            </main>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });

    it("page has multiple headings for structure", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <h1>Page Title</h1>
            <div>
              <h2>Section 1</h2>
              <p>Content</p>
            </div>
            <div>
              <h2>Section 2</h2>
              <p>More content</p>
            </div>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });

    it("page has skip link with aria-label", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <a href="#content" aria-label="Skip to main content"></a>
            <nav>Navigation</nav>
            <div id="content">
              <h1>Main</h1>
            </div>
          </body>
        </html>
      `);

      const results = await scanner.scan(container.ownerDocument.documentElement);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("page has no bypass mechanism", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <div>
              <a href="/page1">Link 1</a>
              <a href="/page2">Link 2</a>
            </div>
            <div>
              <p>Some content without structure</p>
            </div>
          </body>
        </html>
      `);

      const results = (await scanner.scan(container.ownerDocument.documentElement)).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Page must have means to bypass repeated blocks",
          url: "https://dequeuniversity.com/rules/axe/4.4/bypass?application=RuleDescription",
        },
      ]);
    });

    it("page has only one heading", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <h1>Page Title</h1>
            <div>
              <p>Content without additional structure</p>
            </div>
          </body>
        </html>
      `);

      const results = (await scanner.scan(container.ownerDocument.documentElement)).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Page must have means to bypass repeated blocks",
          url: "https://dequeuniversity.com/rules/axe/4.4/bypass?application=RuleDescription",
        },
      ]);
    });

    it("page has skip link without accessible text", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <a href="#main"></a>
            <div>
              <a href="/link1">Link 1</a>
              <a href="/link2">Link 2</a>
            </div>
            <div id="main">
              <p>Content</p>
            </div>
          </body>
        </html>
      `);

      const results = (await scanner.scan(container.ownerDocument.documentElement)).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Page must have means to bypass repeated blocks",
          url: "https://dequeuniversity.com/rules/axe/4.4/bypass?application=RuleDescription",
        },
      ]);
    });

    it("page has skip link that doesn't point to valid target", async () => {
      const container = await fixture(html`
        <html>
          <body>
            <a href="#nonexistent">Skip to content</a>
            <div>
              <a href="/link1">Link 1</a>
              <a href="/link2">Link 2</a>
            </div>
            <div>
              <p>Content</p>
            </div>
          </body>
        </html>
      `);

      const results = (await scanner.scan(container.ownerDocument.documentElement)).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Page must have means to bypass repeated blocks",
          url: "https://dequeuniversity.com/rules/axe/4.4/bypass?application=RuleDescription",
        },
      ]);
    });
  });
});

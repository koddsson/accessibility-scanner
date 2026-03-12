import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import region from "../src/rules/region";

const scanner = new Scanner([region]);

const errorResult = {
  text: "All page content should be contained by landmarks",
  url: "https://dequeuniversity.com/rules/axe/4.11/region",
};

describe("region", function () {
  describe("passes when", function () {
    it("all content is inside a main landmark", async () => {
      const el = await fixture(
        html`<div><main><p>Hello world</p></main></div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("all content is inside various landmark elements", async () => {
      const el = await fixture(
        html`<div>
          <header><p>Header content</p></header>
          <nav><a href="/">Home</a></nav>
          <main><p>Main content</p></main>
          <aside><p>Sidebar</p></aside>
          <footer><p>Footer content</p></footer>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("all content is inside role= landmark elements", async () => {
      const el = await fixture(
        html`<div>
          <div role="banner"><p>Banner</p></div>
          <div role="navigation"><a href="/">Home</a></div>
          <div role="main"><p>Main content</p></div>
          <div role="contentinfo"><p>Footer</p></div>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("content is inside section with aria-label", async () => {
      const el = await fixture(
        html`<div>
          <section aria-label="Main section"><p>Content here</p></section>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("content is inside section with aria-labelledby", async () => {
      const el = await fixture(
        html`<div>
          <section aria-labelledby="heading1">
            <h2 id="heading1">Section title</h2>
            <p>Content here</p>
          </section>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("content is inside form with aria-label", async () => {
      const el = await fixture(
        html`<div>
          <form aria-label="Search form">
            <input type="text" />
          </form>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("script and style elements outside landmarks are exempt", async () => {
      const el = await fixture(
        html`<div>
          <script>
            console.log("hello");
          </script>
          <style>
            body {
              color: red;
            }
          </style>
          <main><p>Content</p></main>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("hidden elements outside landmarks are exempt", async () => {
      const el = await fixture(
        html`<div>
          <div aria-hidden="true"><p>Hidden content</p></div>
          <div style="display: none"><p>Also hidden</p></div>
          <main><p>Visible content</p></main>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("content is inside complementary landmark", async () => {
      const el = await fixture(
        html`<div>
          <div role="complementary"><p>Complementary content</p></div>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });

    it("content is inside search landmark", async () => {
      const el = await fixture(
        html`<div>
          <div role="search"><input type="text" /></div>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.be.empty;
    });
  });

  describe("fails when", function () {
    it("text content is outside any landmark", async () => {
      const el = await fixture(html`<div><p>Outside content</p></div>`);
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.deep.include(errorResult);
    });

    it("form element is outside any landmark", async () => {
      const el = await fixture(
        html`<div><input type="text" placeholder="Name" /></div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.deep.include(errorResult);
    });

    it("image is outside any landmark", async () => {
      const el = await fixture(
        html`<div><img src="test.png" alt="Test" /></div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.deep.include(errorResult);
    });

    it("some content is inside landmark and some is outside", async () => {
      const el = await fixture(
        html`<div>
          <main><p>Inside landmark</p></main>
          <p>Outside landmark</p>
        </div>`,
      );
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });
      expect(results).to.deep.include(errorResult);
    });
  });
});

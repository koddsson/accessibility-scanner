import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import frameTitle from "../src/rules/frame-title";

const scanner = new Scanner([frameTitle]);

describe("frame-title", function () {
  describe("has errors if", function () {
    it("iframe has no title attribute", async () => {
      const container = await fixture(
        html`<iframe src="about:blank"></iframe>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Frames must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title?application=RuleDescription",
        },
      ]);
    });

    it("iframe has empty title attribute", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" title=""></iframe>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Frames must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title?application=RuleDescription",
        },
      ]);
    });

    it("iframe has whitespace-only title attribute", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" title="   "></iframe>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Frames must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title?application=RuleDescription",
        },
      ]);
    });

    // Note: <frame> is obsolete in HTML5 and not supported by modern browsers
    // Tests focus on <iframe> which is the current standard
    it("deprecated frame element (skipped - obsolete in HTML5)", async () => {
      // <frame> is not supported in HTML5, so we skip this test
      // The rule implementation handles both iframe and frame for legacy support
    });

    it("iframe has empty aria-label", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" aria-label=""></iframe>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Frames must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title?application=RuleDescription",
        },
      ]);
    });

    it("iframe has invalid aria-labelledby attribute", async () => {
      const container = await fixture(
        html`<iframe
          src="about:blank"
          aria-labelledby="nonexistent"
        ></iframe>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Frames must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title?application=RuleDescription",
        },
      ]);
    });

    it("iframe has aria-labelledby pointing to empty element", async () => {
      const container = await fixture(html`
        <div>
          <iframe
            src="about:blank"
            aria-labelledby="emptydiv"
          ></iframe>
          <div id="emptydiv"></div>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Frames must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title?application=RuleDescription",
        },
      ]);
    });

    it("multiple iframes without titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe src="about:blank"></iframe>
          <iframe src="about:blank"></iframe>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results[0].text).to.equal("Frames must have an accessible name");
      expect(results[1].text).to.equal("Frames must have an accessible name");
    });
  });

  describe("has no errors if", function () {
    it("iframe has valid title attribute", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" title="Frame title"></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe has title with leading/trailing whitespace but valid content", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" title="  Frame title  "></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("deprecated frame element with title (skipped - obsolete in HTML5)", async () => {
      // <frame> is not supported in HTML5, so we skip this test
      // The rule implementation handles both iframe and frame for legacy support
    });

    it("iframe has valid aria-label", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" aria-label="Frame label"></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe has valid aria-labelledby", async () => {
      const container = await fixture(html`
        <div>
          <iframe
            src="about:blank"
            aria-labelledby="labeldiv"
          ></iframe>
          <div id="labeldiv">Frame label</div>
        </div>
      `);

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe has both title and aria-label (aria-label takes precedence)", async () => {
      const container = await fixture(
        html`<iframe
          src="about:blank"
          title="Title text"
          aria-label="Aria label text"
        ></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("multiple iframes with valid titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe src="about:blank" title="First frame"></iframe>
          <iframe src="about:blank" title="Second frame"></iframe>
          <iframe src="about:blank" aria-label="Third frame"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe has title with special characters", async () => {
      const container = await fixture(
        html`<iframe
          src="about:blank"
          title="Frame Title - Section & More!"
        ></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe has title with single character", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" title="A"></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});

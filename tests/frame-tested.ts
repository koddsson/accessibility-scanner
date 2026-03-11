import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import frameTested from "../src/rules/frame-tested";

const scanner = new Scanner([frameTested]);

describe("frame-tested", function () {
  describe("has errors if", function () {
    it("iframe does not contain the scanner script", async () => {
      const container = await fixture(
        html`<iframe src="about:blank"></iframe>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <iframe> and <frame> elements contain the axe-core script",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-tested",
        },
      ]);
    });

    it("multiple iframes without the scanner script", async () => {
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
      expect(results[0]).to.eql({
        text: "Ensures <iframe> and <frame> elements contain the axe-core script",
        url: "https://dequeuniversity.com/rules/axe/4.4/frame-tested",
      });
    });

    it("iframe with unrelated scripts", async () => {
      const container = await fixture(
        html`<iframe src="about:blank"></iframe>`,
      );

      // Add an unrelated script to the iframe's content document
      const iframe = container as HTMLIFrameElement;
      if (iframe.contentDocument) {
        const script = iframe.contentDocument.createElement("script");
        script.setAttribute("src", "some-other-lib.js");
        iframe.contentDocument.head.appendChild(script);
      }

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text: "Ensures <iframe> and <frame> elements contain the axe-core script",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-tested",
        },
      ]);
    });
  });

  describe("has no errors if", function () {
    it("iframe contains the accessibility-scanner script via src", async () => {
      const container = await fixture(
        html`<iframe src="about:blank"></iframe>`,
      );

      // Inject the scanner script into the iframe's content document
      const iframe = container as HTMLIFrameElement;
      if (iframe.contentDocument) {
        const script = iframe.contentDocument.createElement("script");
        script.setAttribute("src", "path/to/accessibility-scanner.js");
        iframe.contentDocument.head.appendChild(script);
      }

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe contains the axe-core script via src", async () => {
      const container = await fixture(
        html`<iframe src="about:blank"></iframe>`,
      );

      // Inject the axe-core script into the iframe's content document
      const iframe = container as HTMLIFrameElement;
      if (iframe.contentDocument) {
        const script = iframe.contentDocument.createElement("script");
        script.setAttribute("src", "path/to/axe-core/axe.min.js");
        iframe.contentDocument.head.appendChild(script);
      }

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe contains the scanner script inline", async () => {
      const container = await fixture(
        html`<iframe src="about:blank"></iframe>`,
      );

      // Inject the scanner script as inline content
      const iframe = container as HTMLIFrameElement;
      if (iframe.contentDocument) {
        const script = iframe.contentDocument.createElement("script");
        script.textContent =
          'import { scan } from "accessibility-scanner";';
        iframe.contentDocument.head.appendChild(script);
      }

      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe is hidden with aria-hidden", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" aria-hidden="true"></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("iframe is hidden with display:none", async () => {
      const container = await fixture(
        html`<iframe src="about:blank" style="display: none;"></iframe>`,
      );
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });

    it("no iframe or frame elements are present", async () => {
      const container = await fixture(html`
        <div>
          <p>No frames here</p>
        </div>
      `);
      const results = await scanner.scan(container);

      expect(results).to.be.empty;
    });
  });
});

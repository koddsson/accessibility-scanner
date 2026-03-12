import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaCommandName from "../src/rules/aria-command-name";

const scanner = new Scanner([ariaCommandName]);

describe("aria-command-name", function () {
  describe("has no errors if", function () {
    it("a role=link element has an aria-label", async () => {
      const container = await fixture(
        html`<div role="link" aria-label="Name">Link</div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("a role=button element has an aria-labelledby", async () => {
      const container = await fixture(
        html`<div>
          <div role="button" aria-labelledby="labeldiv">Click</div>
          <div id="labeldiv">Button label</div>
        </div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });

    it("a role=menuitem element has text content", async () => {
      const container = await fixture(
        html`<div role="menuitem">Menu Item</div>`,
      );
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("a role=link element has no accessible name", async () => {
      const container = await fixture(html`<div role="link"></div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "ARIA button, link, and menuitem must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-command-name",
        },
      ]);
    });

    it("a role=button element has no accessible name", async () => {
      const container = await fixture(html`<div role="button"></div>`);
      const results = (await scanner.scan(container)).map(({ text, url }) => ({
        text,
        url,
      }));
      expect(results).to.eql([
        {
          text: "ARIA button, link, and menuitem must have an accessible name",
          url: "https://dequeuniversity.com/rules/axe/4.11/aria-command-name",
        },
      ]);
    });

    it("includes id in errors", async () => {
      const container = await fixture(html`<div role="menuitem"></div>`);
      const results = await scanner.scan(container);

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.have.property("id", "aria-command-name");
      expect(results[0]).to.have.property("text");
      expect(results[0]).to.have.property("url");
      expect(results[0]).to.have.property("element");
    });
  });
});

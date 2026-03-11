import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import linkInTextBlock from "../src/rules/link-in-text-block";

const scanner = new Scanner([linkInTextBlock]);

describe("link-in-text-block", function () {
  describe("has no errors if", function () {
    it("link is inside a nav element", async () => {
      const container = await fixture(
        html`<nav>
          <p>
            Some surrounding text with a
            <a href="/page" style="color: blue;">navigation link</a>
            and more text around it.
          </p>
        </nav>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("link is inside an element with role='navigation'", async () => {
      const container = await fixture(
        html`<div role="navigation">
          <p>
            Some surrounding text with a
            <a href="/page" style="color: blue;">navigation link</a>
            and more text around it.
          </p>
        </div>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("link has a different background color", async () => {
      const container = await fixture(
        html`<p style="background-color: rgb(255, 255, 255);">
          Some surrounding text with a
          <a
            href="/page"
            style="color: blue; background-color: rgb(230, 230, 250);"
            >styled link</a
          >
          and more text around it.
        </p>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("link has font-weight difference from parent", async () => {
      const container = await fixture(
        html`<p style="font-weight: 400;">
          Some surrounding text with a
          <a href="/page" style="color: blue; font-weight: 700;">bold link</a>
          and more text around it.
        </p>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });

    it("link has an underline", async () => {
      const container = await fixture(
        html`<p>
          Some surrounding text with an
          <a href="/page" style="text-decoration: underline;">underlined link</a
          >
          and more text around it.
        </p>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(0);
    });
  });

  describe("has errors if", function () {
    it("link in text block relies only on color", async () => {
      const container = await fixture(
        html`<p>
          Some surrounding text with a
          <a
            href="/page"
            style="color: blue; text-decoration: none; font-weight: 400;"
            >colored link</a
          >
          and more text around it.
        </p>`,
      );
      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.equal("link-in-text-block");
    });
  });
});

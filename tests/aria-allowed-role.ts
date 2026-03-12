import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaAllowedRole from "../src/rules/aria-allowed-role";

const scanner = new Scanner([ariaAllowedRole]);

describe("aria-allowed-role", function () {
  it("div with role=button passes", async () => {
    const container = await fixture(html`<div role="button">Click me</div>`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("button with role=link passes", async () => {
    const container = await fixture(
      html`<div><button role="link">Go somewhere</button></div>`,
    );
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("meta with role fails", async () => {
    const container = await fixture(
      html`<div><meta role="banner" /></div>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA role should be appropriate for the element",
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-allowed-role",
      },
    ]);
  });

  it("script with role fails", async () => {
    const container = await fixture(
      html`<div><script role="navigation"></script></div>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA role should be appropriate for the element",
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-allowed-role",
      },
    ]);
  });

  it("regular elements without role pass", async () => {
    const container = await fixture(html`
      <div>
        <p>Some text</p>
        <span>More text</span>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("div with valid role passes", async () => {
    const container = await fixture(
      html`<div role="navigation">Nav content</div>`,
    );
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });
});

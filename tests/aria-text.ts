import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaText from "../src/rules/aria-text";

const scanner = new Scanner([ariaText]);

describe("aria-text", function () {
  it("passes when role=text has no focusable children", async () => {
    const container = await fixture(
      html`<span role="text">Hello <em>world</em></span>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.be.empty;
  });

  it("fails when role=text contains a link", async () => {
    const container = await fixture(
      html`<span role="text">Hello <a href="#">world</a></span>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.eql([
      {
        text: '"role=text" should have no focusable descendants',
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-text",
      },
    ]);
  });

  it("fails when role=text contains a button", async () => {
    const container = await fixture(
      html`<span role="text">Hello <button>click</button></span>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.have.lengthOf(1);
  });

  it("fails when role=text contains an input", async () => {
    const container = await fixture(
      html`<span role="text">Hello <input type="text" /></span>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.have.lengthOf(1);
  });

  it("fails when role=text contains an element with tabindex=0", async () => {
    const container = await fixture(
      html`<span role="text">Hello <span tabindex="0">focusable</span></span>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.have.lengthOf(1);
  });

  it("passes when no role=text is present", async () => {
    const container = await fixture(
      html`<span>Hello <a href="#">world</a></span>`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.be.empty;
  });

  it("passes when role=text contains tabindex=-1", async () => {
    const container = await fixture(
      html`<span role="text"
        >Hello <span tabindex="-1">not focusable</span></span
      >`,
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => ({
      text,
      url,
    }));
    expect(results).to.be.empty;
  });
});

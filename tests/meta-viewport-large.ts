import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import metaViewportLarge from "../src/rules/meta-viewport-large";

const scanner = new Scanner([metaViewportLarge]);

describe("meta-viewport-large", function () {
  it("maximum-scale=5 has no errors", async () => {
    const meta = await fixture(html`
      <div>
        <meta name="viewport" id="mvp" content="maximum-scale=5" />
      </div>
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("maximum-scale=10 has no errors", async () => {
    const meta = await fixture(html`
      <div>
        <meta name="viewport" id="mvp" content="maximum-scale=10" />
      </div>
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("maximum-scale=2 should fail", async () => {
    const meta = await fixture(html`
      <div>
        <meta name="viewport" id="mvp" content="maximum-scale=2" />
      </div>
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Users should be able to zoom and scale the text up to 500%",
        url: "https://dequeuniversity.com/rules/axe/4.11/meta-viewport-large",
      },
    ]);
  });

  it("user-scalable=no should fail", async () => {
    const meta = await fixture(html`
      <meta
        name="viewport"
        id="mvp"
        content="User-Scalable=no, maximum-scale=5"
      />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Users should be able to zoom and scale the text up to 500%",
        url: "https://dequeuniversity.com/rules/axe/4.11/meta-viewport-large",
      },
    ]);
  });

  it("no viewport meta has no errors", async () => {
    const el = await fixture(html`<div>Hello</div>`);

    const results = await scanner.scan(el);

    expect(results).to.be.empty;
  });

  it("initial-scale is fine", async () => {
    const meta = await fixture(html`
      <meta
        name="viewport"
        id="mvp"
        content="width=device-width, initial-scale=1.0"
      />
    `);

    expect(await scanner.scan(meta)).to.be.empty;
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import metaRefresh from "../src/rules/meta-refresh";

const scanner = new Scanner([metaRefresh]);

describe("meta-refresh", function () {
  it("returns errors if a meta element has a `http-equiv` attribute with value of `refresh`", async () => {
    const meta = await fixture(html`
      <meta http-equiv="refresh" content="3000" />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Timed refresh must not exist",
        url: "https://dequeuniversity.com/rules/axe/4.4/meta-refresh",
      },
    ]);
  });

  it("doesn't returns errors if a meta element has a `http-equiv` attribute with value other than `refresh`", async () => {
    const meta = await fixture(html`
      <meta
        http-equiv="refreshing shrubs on a hot summer night"
        content="3000"
      />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("doesn't returns errors if a meta element doesn't has a `http-equiv` attribute", async () => {
    const meta = await fixture(html`
      <meta
        http-equiv="refreshing shrubs on a hot summer night"
        content="3000"
      />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

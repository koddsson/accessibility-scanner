import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import metaRefreshNoExceptions from "../src/rules/meta-refresh-no-exceptions";

const scanner = new Scanner([metaRefreshNoExceptions]);

describe("meta-refresh-no-exceptions", function () {
  it("does not return errors when meta refresh has delay of 0", async () => {
    const meta = await fixture(html`
      <meta http-equiv="refresh" content="0" />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors when meta refresh has a non-zero delay", async () => {
    const meta = await fixture(html`
      <meta http-equiv="refresh" content="3000" />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Delayed refresh under 20 hours must not be used",
        url: "https://dequeuniversity.com/rules/axe/4.11/meta-refresh-no-exceptions",
      },
    ]);
  });

  it("does not return errors when meta refresh has delay of 0 with URL redirect", async () => {
    const meta = await fixture(html`
      <meta http-equiv="refresh" content="0;url=https://example.com" />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors when meta refresh has a large delay", async () => {
    const meta = await fixture(html`
      <meta http-equiv="refresh" content="72000" />
    `);

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Delayed refresh under 20 hours must not be used",
        url: "https://dequeuniversity.com/rules/axe/4.11/meta-refresh-no-exceptions",
      },
    ]);
  });

  it("does not return errors when there is no meta refresh element", async () => {
    const div = await fixture(html` <div>No meta here</div> `);

    const results = (await scanner.scan(div)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { scan } from "../src/scanner";

describe("meta-viewport", function () {
  it("maximum-scale=2 has no errors", async () => {
    const meta = await fixture(html`
      <div>
      <meta name="viewport" id="mvp" content="maximum-scale=2" />
      </div>
    `);

    const results = (await scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

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

    expect(await scan(meta)).to.be.empty;
  });

  it("user-scalable should fail", async () => {
    const meta = await fixture(html`
      <meta
        name="viewport"
        id="mvp"
        content="User-Scalable=no, maximum-scale=2"
      />
    `);

    const results = (await scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Zooming and scaling must not be disabled",
        url: "https://dequeuniversity.com/rules/axe/4.4/meta-viewport?application=RuleDescription",
      },
    ]);
  });

  it("maximum-scale less than 2 should error", async () => {
    const meta = await fixture(html`
      <meta name="viewport" id="mvp" content="maximum-scale=1.5;" />
    `);

    const results = (await scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Zooming and scaling must not be disabled",
        url: "https://dequeuniversity.com/rules/axe/4.4/meta-viewport?application=RuleDescription",
      },
    ]);
  });
});

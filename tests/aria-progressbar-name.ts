import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaProgressbarName from "../src/rules/aria-progressbar-name";

const scanner = new Scanner([ariaProgressbarName]);

describe("aria-progressbar-name", function () {
  it("progressbar with aria-label passes", async () => {
    const container = await fixture(html`
      <div
        role="progressbar"
        aria-label="Loading progress"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("progressbar with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="progressLabel">Download progress</p>
        <div
          role="progressbar"
          aria-labelledby="progressLabel"
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("progressbar with title attribute passes", async () => {
    const container = await fixture(html`
      <div
        role="progressbar"
        title="Upload progress"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("progressbar without accessible name fails", async () => {
    const container = await fixture(html`
      <div
        role="progressbar"
        aria-valuenow="30"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA progressbar must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-progressbar-name?application=RuleDescription",
      },
    ]);
  });

  it("progressbar with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div
        role="progressbar"
        aria-label="  "
        aria-valuenow="40"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA progressbar must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-progressbar-name?application=RuleDescription",
      },
    ]);
  });

  it("progressbar with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div
        role="progressbar"
        aria-labelledby="non-existing-id"
        aria-valuenow="60"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA progressbar must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-progressbar-name?application=RuleDescription",
      },
    ]);
  });

  it("progressbar with empty title fails", async () => {
    const container = await fixture(html`
      <div
        role="progressbar"
        title=" "
        aria-valuenow="80"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA progressbar must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-progressbar-name?application=RuleDescription",
      },
    ]);
  });

  it("native progress element is ignored", async () => {
    const container = await fixture(html`<progress value="70" max="100"></progress>`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("multiple progressbars with mixed accessible names", async () => {
    const container = await fixture(html`
      <div>
        <div role="progressbar" aria-label="Valid progress" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
        <div role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "ARIA progressbar must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-progressbar-name?application=RuleDescription",
    });
  });
});

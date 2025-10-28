import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaMeterName from "../src/rules/aria-meter-name";

const scanner = new Scanner([ariaMeterName]);

describe("aria-meter-name", function () {
  it("meter with aria-label passes", async () => {
    const container = await fixture(html`
      <div
        role="meter"
        aria-label="CPU usage"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("meter with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="meterLabel">Memory usage</p>
        <div
          role="meter"
          aria-labelledby="meterLabel"
          aria-valuenow="50"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("meter with title attribute passes", async () => {
    const container = await fixture(html`
      <div
        role="meter"
        title="Disk usage"
        aria-valuenow="85"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("meter without accessible name fails", async () => {
    const container = await fixture(html`
      <div
        role="meter"
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
        text: "ARIA meter must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-meter-name?application=RuleDescription",
      },
    ]);
  });

  it("meter with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div
        role="meter"
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
        text: "ARIA meter must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-meter-name?application=RuleDescription",
      },
    ]);
  });

  it("meter with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div
        role="meter"
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
        text: "ARIA meter must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-meter-name?application=RuleDescription",
      },
    ]);
  });

  it("meter with empty title fails", async () => {
    const container = await fixture(html`
      <div
        role="meter"
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
        text: "ARIA meter must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-meter-name?application=RuleDescription",
      },
    ]);
  });

  it("native meter element is ignored", async () => {
    const container = await fixture(html`<meter value="70" min="0" max="100"></meter>`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("multiple meters with mixed accessible names", async () => {
    const container = await fixture(html`
      <div>
        <div role="meter" aria-label="Valid meter" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
        <div role="meter" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "ARIA meter must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-meter-name?application=RuleDescription",
    });
  });
});

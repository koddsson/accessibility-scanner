import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import marquee from "../src/rules/marquee";

const scanner = new Scanner([marquee]);

describe("marquee", function () {
  it("returns errors if a marquee element is present", async () => {
    const marqueeElement = await fixture(html`
      <marquee>This is a marquee</marquee>
    `);

    const results = (await scanner.scan(marqueeElement)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<marquee> elements are not used",
        url: "https://dequeuniversity.com/rules/axe/4.4/marquee?application=RuleDescription",
      },
    ]);
  });

  it("returns errors for multiple marquee elements", async () => {
    const container = await fixture(html`
      <div>
        <marquee>First marquee</marquee>
        <marquee>Second marquee</marquee>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "<marquee> elements are not used",
      url: "https://dequeuniversity.com/rules/axe/4.4/marquee?application=RuleDescription",
    });
    expect(results[1]).to.eql({
      text: "<marquee> elements are not used",
      url: "https://dequeuniversity.com/rules/axe/4.4/marquee?application=RuleDescription",
    });
  });

  it("doesn't return errors if no marquee elements are present", async () => {
    const div = await fixture(html`
      <div>
        <p>Normal content</p>
      </div>
    `);

    const results = (await scanner.scan(div)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors for nested marquee elements", async () => {
    const container = await fixture(html`
      <div>
        <marquee>
          <span>Nested content</span>
        </marquee>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "<marquee> elements are not used",
      url: "https://dequeuniversity.com/rules/axe/4.4/marquee?application=RuleDescription",
    });
  });
});

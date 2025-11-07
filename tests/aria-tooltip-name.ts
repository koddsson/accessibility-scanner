import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaTooltipName from "../src/rules/aria-tooltip-name";

const scanner = new Scanner([ariaTooltipName]);

describe("aria-tooltip-name", function () {
  it("tooltip with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="tooltip" aria-label="Additional information">
        Tooltip content
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("tooltip with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="tooltipLabel">Help text</p>
        <div role="tooltip" aria-labelledby="tooltipLabel">
          Tooltip content
        </div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("tooltip with title attribute passes", async () => {
    const container = await fixture(html`
      <div role="tooltip" title="Tooltip name">
        Tooltip content
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("tooltip with text content passes", async () => {
    const container = await fixture(html`
      <div role="tooltip">Helpful information</div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("tooltip without accessible name fails", async () => {
    const container = await fixture(html` <div role="tooltip"></div> `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });

  it("tooltip with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div role="tooltip" aria-label="  ">Content</div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });

  it("tooltip with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div role="tooltip" aria-labelledby="non-existing-id">Content</div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });

  it("tooltip with empty title fails", async () => {
    const container = await fixture(html`
      <div role="tooltip" title=" ">Content</div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });

  it("tooltip with only whitespace content fails", async () => {
    const container = await fixture(html` <div role="tooltip">   </div> `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });

  it("multiple tooltips with mixed accessible names", async () => {
    const container = await fixture(html`
      <div>
        <div role="tooltip" aria-label="Valid tooltip">First tooltip</div>
        <div role="tooltip"></div>
        <div role="tooltip"></div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "ARIA tooltip must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
    });
    expect(results[1]).to.eql({
      text: "ARIA tooltip must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
    });
  });

  it("nested tooltips are each checked separately", async () => {
    const container = await fixture(html`
      <div role="tooltip" aria-label="Outer tooltip">
        <div role="tooltip"></div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "ARIA tooltip must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
    });
  });

  it("element without tooltip role is ignored", async () => {
    const container = await fixture(html`<div>Regular div content</div>`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("tooltip with aria-labelledby pointing to empty element fails", async () => {
    const container = await fixture(html`
      <div>
        <p id="emptyLabel"></p>
        <div role="tooltip" aria-labelledby="emptyLabel">Content</div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });

  it("tooltip with aria-labelledby pointing to whitespace-only element fails", async () => {
    const container = await fixture(html`
      <div>
        <p id="whitespaceLabel">   </p>
        <div role="tooltip" aria-labelledby="whitespaceLabel">Content</div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA tooltip must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-tooltip-name?application=RuleDescription",
      },
    ]);
  });
});

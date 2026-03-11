import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaTreeitemName from "../src/rules/aria-treeitem-name";

const scanner = new Scanner([ariaTreeitemName]);

describe("aria-treeitem-name", function () {
  it("treeitem with text content passes", async () => {
    const container = await fixture(html`
      <div role="treeitem">Tree item text</div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("treeitem with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="treeitem" aria-label="Tree item name"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("treeitem with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="treeitemLabel">Tree item label</p>
        <div role="treeitem" aria-labelledby="treeitemLabel"></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("treeitem with title attribute passes", async () => {
    const container = await fixture(html`
      <div role="treeitem" title="Tree item name"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("treeitem without accessible name fails", async () => {
    const container = await fixture(html` <div role="treeitem"></div> `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA treeitem nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-treeitem-name",
      },
    ]);
  });

  it("treeitem with only whitespace content fails", async () => {
    const container = await fixture(html`
      <div role="treeitem">   </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA treeitem nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-treeitem-name",
      },
    ]);
  });

  it("treeitem with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div role="treeitem" aria-label="  ">Content</div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA treeitem nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-treeitem-name",
      },
    ]);
  });

  it("treeitem with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div role="treeitem" aria-labelledby="non-existing-id">Content</div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA treeitem nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.11/aria-treeitem-name",
      },
    ]);
  });

  it("element without treeitem role is ignored", async () => {
    const container = await fixture(html`<div>Regular div content</div>`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("multiple treeitems with mixed accessible names", async () => {
    const container = await fixture(html`
      <div>
        <div role="treeitem" aria-label="Valid item">First item</div>
        <div role="treeitem"></div>
        <div role="treeitem"></div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "ARIA treeitem nodes must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.11/aria-treeitem-name",
    });
    expect(results[1]).to.eql({
      text: "ARIA treeitem nodes must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.11/aria-treeitem-name",
    });
  });
});

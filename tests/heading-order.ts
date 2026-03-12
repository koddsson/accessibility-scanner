import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import headingOrder from "../src/rules/heading-order";

const scanner = new Scanner([headingOrder]);

describe("heading-order", function () {
  it("does not flag h1 followed by h2", async () => {
    const element = await fixture(html`
      <div>
        <h1>Title</h1>
        <h2>Subtitle</h2>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("flags h1 followed by h3 (skipping h2)", async () => {
    const element = await fixture(html`
      <div>
        <h1>Title</h1>
        <h3>Skipped level</h3>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => ({
      text,
      url,
    }));

    expect(results).to.eql([
      {
        text: "Heading levels should only increase by one",
        url: "https://dequeuniversity.com/rules/axe/4.11/heading-order",
      },
    ]);
  });

  it("flags h2 followed by h4 (skipping h3)", async () => {
    const element = await fixture(html`
      <div>
        <h2>Subtitle</h2>
        <h4>Skipped level</h4>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => ({
      text,
      url,
    }));

    expect(results).to.eql([
      {
        text: "Heading levels should only increase by one",
        url: "https://dequeuniversity.com/rules/axe/4.11/heading-order",
      },
    ]);
  });

  it("does not flag h1 then h2 then h3 in sequence", async () => {
    const element = await fixture(html`
      <div>
        <h1>Title</h1>
        <h2>Subtitle</h2>
        <h3>Sub-subtitle</h3>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("does not flag when there are no headings", async () => {
    const element = await fixture(html`
      <div>
        <p>No headings here</p>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("does not flag a single heading", async () => {
    const element = await fixture(html`
      <div>
        <h3>Just one heading</h3>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("handles role='heading' with aria-level", async () => {
    const element = await fixture(html`
      <div>
        <h1>Title</h1>
        <div role="heading" aria-level="3">Skipped via role</div>
      </div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => ({
      text,
      url,
    }));

    expect(results).to.eql([
      {
        text: "Heading levels should only increase by one",
        url: "https://dequeuniversity.com/rules/axe/4.11/heading-order",
      },
    ]);
  });

  it("role='heading' without aria-level defaults to level 2", async () => {
    const element = await fixture(html`
      <div>
        <h1>Title</h1>
        <div role="heading">Implicit level 2</div>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });
});

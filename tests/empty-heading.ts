import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import emptyHeading from "../src/rules/empty-heading";

const scanner = new Scanner([emptyHeading]);

describe("empty-heading", function () {
  it("returns no errors for headings with text content", async () => {
    const element = await fixture(html`
      <div>
        <h1>Page Title</h1>
        <h2>Section Title</h2>
        <h3>Subsection Title</h3>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("returns an error for an empty h1", async () => {
    const element = await fixture(html` <h1></h1> `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Headings must have discernible text",
        url: "https://dequeuniversity.com/rules/axe/4.11/empty-heading",
      },
    ]);
  });

  it("returns errors for multiple empty headings", async () => {
    const element = await fixture(html`
      <div>
        <h1></h1>
        <h2></h2>
        <h3></h3>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(3);
  });

  it("returns an error for a heading with only whitespace", async () => {
    const element = await fixture(html` <h2>   </h2> `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
  });

  it("returns no errors for a heading with aria-label", async () => {
    const element = await fixture(html`
      <h1 aria-label="Accessible heading"></h1>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("returns an error for a heading with empty aria-label", async () => {
    const element = await fixture(html` <h1 aria-label=""></h1> `);

    const results = await scanner.scan(element);
    expect(results).to.have.lengthOf(1);
  });

  it("returns no errors for a heading with a valid aria-labelledby", async () => {
    const element = await fixture(html`
      <div>
        <span id="heading-label">My heading text</span>
        <h1 aria-labelledby="heading-label"></h1>
      </div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("returns no errors for a heading with title attribute", async () => {
    const element = await fixture(html`
      <h1 title="Heading title"></h1>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("returns an error for an element with role='heading' and no text", async () => {
    const element = await fixture(html`
      <div role="heading" aria-level="1"></div>
    `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Headings must have discernible text",
        url: "https://dequeuniversity.com/rules/axe/4.11/empty-heading",
      },
    ]);
  });

  it("returns no errors for an element with role='heading' and text", async () => {
    const element = await fixture(html`
      <div role="heading" aria-level="2">Section</div>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });

  it("returns no errors for headings containing child elements with text", async () => {
    const element = await fixture(html`
      <h1><span>Heading text inside span</span></h1>
    `);

    const results = await scanner.scan(element);
    expect(results).to.be.empty;
  });
});

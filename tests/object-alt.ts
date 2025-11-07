import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import objectAlt from "../src/rules/object-alt";

const scanner = new Scanner([objectAlt]);

describe("object-alt", function () {
  it("object element with title attribute passes", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" title="Example PDF"></object>
      </div>
    `);

    expect(await scanner.scan(container)).to.be.empty;
  });

  it("object element with aria-label attribute passes", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" aria-label="Example PDF"></object>
      </div>
    `);

    expect(await scanner.scan(container)).to.be.empty;
  });

  it("object element with valid aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <div id="pdf-label">Example PDF</div>
        <object data="example.pdf" aria-labelledby="pdf-label"></object>
      </div>
    `);

    expect(await scanner.scan(container)).to.be.empty;
  });

  it("object element with role='presentation' passes", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" role="presentation"></object>
      </div>
    `);

    expect(await scanner.scan(container)).to.be.empty;
  });

  it("object element with role='none' passes", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" role="none"></object>
      </div>
    `);

    expect(await scanner.scan(container)).to.be.empty;
  });

  it("object element without alternative text fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf"></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("object element with empty title fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" title=""></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("object element with whitespace-only title fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" title="   "></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("object element with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" aria-label=""></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("object element with whitespace-only aria-label fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" aria-label="  "></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("object element with invalid aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" aria-labelledby="nonexistent"></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("object element with empty aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div>
        <object data="example.pdf" aria-labelledby=""></object>
      </div>
    `);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });

  it("works with shadow dom", async () => {
    class MyEl extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `<object data="example.pdf"></object>`;
      }
    }
    customElements.define("my-el-object-alt", MyEl);

    const container = await fixture(html`<my-el-object-alt></my-el-object-alt>`);

    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<object> elements must have alternative text",
        url: "https://dequeuniversity.com/rules/axe/4.4/object-alt",
      },
    ]);
  });
});

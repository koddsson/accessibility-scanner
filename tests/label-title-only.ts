import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import labelTitleOnly from "../src/rules/label-title-only";

const scanner = new Scanner([labelTitleOnly]);

describe("label-title-only", function () {
  it("returns no errors for an input with a visible label", async () => {
    const form = await fixture(html`
      <form>
        <label for="name">Name</label>
        <input id="name" type="text" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors for an input with only a title attribute", async () => {
    const form = await fixture(html`
      <form>
        <input type="text" title="Name" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form elements should have a visible label",
        url: "https://dequeuniversity.com/rules/axe/4.11/label-title-only",
      },
    ]);
  });

  it("returns no errors for an input with aria-label", async () => {
    const form = await fixture(html`
      <form>
        <input type="text" aria-label="Name" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns no errors for an input with aria-labelledby", async () => {
    const form = await fixture(html`
      <form>
        <span id="name-label">Name</span>
        <input type="text" aria-labelledby="name-label" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns no errors for an input wrapped in a label", async () => {
    const form = await fixture(html`
      <form>
        <label>
          Name
          <input type="text" />
        </label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors for an input with only aria-describedby", async () => {
    const form = await fixture(html`
      <form>
        <span id="desc">Enter your name</span>
        <input type="text" aria-describedby="desc" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form elements should have a visible label",
        url: "https://dequeuniversity.com/rules/axe/4.11/label-title-only",
      },
    ]);
  });

  it("skips hidden inputs", async () => {
    const form = await fixture(html`
      <form>
        <input type="hidden" title="Hidden field" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors for a select with only a title attribute", async () => {
    const form = await fixture(html`
      <form>
        <select title="Choose one">
          <option>A</option>
        </select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form elements should have a visible label",
        url: "https://dequeuniversity.com/rules/axe/4.11/label-title-only",
      },
    ]);
  });

  it("returns errors for a textarea with only a title attribute", async () => {
    const form = await fixture(html`
      <form>
        <textarea title="Comments"></textarea>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Form elements should have a visible label",
        url: "https://dequeuniversity.com/rules/axe/4.11/label-title-only",
      },
    ]);
  });

  it("returns no errors for an input with no labeling at all", async () => {
    const form = await fixture(html`
      <form>
        <input type="text" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import selectName from "../src/rules/select-name";

const scanner = new Scanner([selectName]);

describe("select-name", function () {
  it("returns errors if there's no label associated with the select element", async () => {
    const form = await fixture(html`
      <form action="#">
        <select></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name",
      },
    ]);
  });

  it("returns no errors if there's a `aria-label` label associated with the select element", async () => {
    const form = await fixture(html`
      <form action="#">
        <select aria-label="label"></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns no errors if there's a valid `aria-labelledby` label associated with the select element", async () => {
    const form = await fixture(html`
      <form action="#">
        <select aria-labelledby="label"></select>
        <div id="label">Label</div>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns no errors if the select is in a immediate parent of a label", async () => {
    const form = await fixture(html`
      <form action="#">
        <label>
          Label
          <select></select>
        </label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors if the select is in a immediate parent of a label but that label has no text", async () => {
    const form = await fixture(html`
      <form action="#">
        <label><select></select></label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name",
      },
    ]);
  });

  it("returns errors if the select is in a immediate parent of a label but that label has no text", async () => {
    const form = await fixture(html`
      <form action="#">
        <label for="my-select">
          <select id="my-select">
            <option>Thing</option>
          </select>
        </label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name",
      },
    ]);
  });

  it("returns errors if the select is in a immediate parent of a label but that label has no text", async () => {
    const form = await fixture(html`
      <form action="#">
        <div>
          <label>
            <select>
              <option selected="selected">Chosen</option>
              <option>Not Selected</option>
            </select>
          </label>
        </div>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name",
      },
    ]);
  });

  it("returns no errors if the select is associated with a label", async () => {
    const form = await fixture(html`
      <form action="#">
        <label for="my-select">Label</label>
        <select id="my-select"></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns no errors if the select has a title attribute", async () => {
    const form = await fixture(html`
      <form action="#">
        <select title="Label"></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors if the select has a presentation or none roles and no labels", async () => {
    const form = await fixture(html`
      <form action="#">
        <select role="presentation"></select>
        <select role="none"></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name",
      },
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name",
      },
    ]);
  });

  it("returns no errors if the select element has presentation or none roles and is disabled", async () => {
    const form = await fixture(html`
      <form action="#">
        <select role="presentation" disabled></select>
        <select role="none" disabled></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

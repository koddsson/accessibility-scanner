import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import selectName from "../src/rules/select-name";

const scanner = new Scanner([selectName]);

describe("select-name", function () {
  it("returns errors if there's no label associated with the select element", async () => {
    const form = await fixture(html`
      <form action="#">
        <select id="fail1"></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription",
      },
    ]);
  });

  it("returns no errors if there's a `aria-label` label associated with the select element", async () => {
    const form = await fixture(html`
      <form action="#">
        <select aria-label="label" id="pass1"></select>
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
        <select aria-labelledby="label" id="pass2"></select>
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
          <select id="pass3"></select>
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
        <label><select id="fail2"></select></label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription",
      },
    ]);
  });

  it("returns errors if the select is in a immediate parent of a label but that label has no text", async () => {
    const form = await fixture(html`
      <form action="#">
        <label for="fail3">
          <select id="fail3">
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
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription",
      },
    ]);
  });

  it("returns errors if the select is in a immediate parent of a label but that label has no text", async () => {
    const form = await fixture(html`
      <form action="#">
        <div>
          <label>
            <select id="fail4">
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
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription",
      },
    ]);
  });

  it("returns no errors if the select is associated with a label", async () => {
    const form = await fixture(html`
      <form action="#">
        <label for="pass4">Label</label>
        <select id="pass4"></select>
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
        <select id="pass5" title="Label"></select>
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
        <select id="fail5" role="presentation"></select>
        <select id="fail6" role="none"></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription",
      },
      {
        text: "select element must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription",
      },
    ]);
  });

  it("returns no errors if the select element has presentation or none roles and is disabled", async () => {
    const form = await fixture(html`
      <form action="#">
        <select id="pass6" role="presentation" disabled></select>
        <select id="pass7" role="none" disabled></select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

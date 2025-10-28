import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import formFieldMultipleLabels from "../src/rules/form-field-multiple-labels";

const scanner = new Scanner([formFieldMultipleLabels]);

describe("form-field-multiple-labels", function () {
  it("fails when input has multiple labels via for attribute", async function () {
    const form = await fixture(html`
      <form>
        <label for="input1">First Label</label>
        <label for="input1">Second Label</label>
        <input type="text" id="input1" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures form field does not have multiple label elements",
        url: "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription",
      },
    ]);
  });

  it("fails when input is nested in label AND has label with for attribute", async function () {
    const form = await fixture(html`
      <form>
        <label>
          First Label
          <input type="text" id="input2" />
        </label>
        <label for="input2">Second Label</label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures form field does not have multiple label elements",
        url: "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription",
      },
    ]);
  });

  it("fails when select has multiple labels via for attribute", async function () {
    const form = await fixture(html`
      <form>
        <label for="select1">First Label</label>
        <label for="select1">Second Label</label>
        <select id="select1">
          <option>Option</option>
        </select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures form field does not have multiple label elements",
        url: "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription",
      },
    ]);
  });

  it("fails when textarea has multiple labels", async function () {
    const form = await fixture(html`
      <form>
        <label for="textarea1">First Label</label>
        <label for="textarea1">Second Label</label>
        <textarea id="textarea1"></textarea>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures form field does not have multiple label elements",
        url: "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription",
      },
    ]);
  });

  it("fails when input has more than two labels", async function () {
    const form = await fixture(html`
      <form>
        <label for="input3">First Label</label>
        <label for="input3">Second Label</label>
        <label for="input3">Third Label</label>
        <input type="text" id="input3" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures form field does not have multiple label elements",
        url: "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription",
      },
    ]);
  });

  it("passes when input has only one label via for attribute", async function () {
    const form = await fixture(html`
      <form>
        <label for="input4">Label</label>
        <input type="text" id="input4" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes when input is nested in a single label", async function () {
    const form = await fixture(html`
      <form>
        <label>
          Label
          <input type="text" id="input5" />
        </label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes when input has no label", async function () {
    const form = await fixture(html`
      <form>
        <input type="text" id="input6" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes when input has no id attribute", async function () {
    const form = await fixture(html`
      <form>
        <label>Label <input type="text" /></label>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes when input is hidden", async function () {
    const form = await fixture(html`
      <form>
        <label for="input7">First Label</label>
        <label for="input7">Second Label</label>
        <input type="hidden" id="input7" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes when select has only one label", async function () {
    const form = await fixture(html`
      <form>
        <label for="select2">Label</label>
        <select id="select2">
          <option>Option</option>
        </select>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes when textarea has only one label", async function () {
    const form = await fixture(html`
      <form>
        <label for="textarea2">Label</label>
        <textarea id="textarea2"></textarea>
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes with mixed form fields where only some have multiple labels", async function () {
    const form = await fixture(html`
      <form>
        <label for="input8">Label</label>
        <input type="text" id="input8" />

        <label for="input9">First Label</label>
        <label for="input9">Second Label</label>
        <input type="text" id="input9" />

        <label for="input10">Label</label>
        <input type="text" id="input10" />
      </form>
    `);

    const results = (await scanner.scan(form)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures form field does not have multiple label elements",
        url: "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription",
      },
    ]);
  });
});

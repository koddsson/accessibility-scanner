import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaToggleFieldName from "../src/rules/aria-toggle-field-name";

const scanner = new Scanner([ariaToggleFieldName]);

describe("aria-toggle-field-name", function () {
  // Passing tests for checkbox role
  it("checkbox with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="checkbox" aria-label="Accept terms" aria-checked="false"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("checkbox with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="checkboxLabel">Subscribe to newsletter</p>
        <div role="checkbox" aria-labelledby="checkboxLabel" aria-checked="true"></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("checkbox with title passes", async () => {
    const container = await fixture(html`
      <div role="checkbox" title="Enable notifications" aria-checked="false"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  // Passing tests for switch role
  it("switch with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="switch" aria-label="Dark mode" aria-checked="false"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("switch with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="switchLabel">Airplane mode</p>
        <div role="switch" aria-labelledby="switchLabel" aria-checked="false"></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  // Passing tests for radio role
  it("radio with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="radio" aria-label="Option A" aria-checked="true"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("radio with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="radioLabel">Small</p>
        <div role="radio" aria-labelledby="radioLabel" aria-checked="false"></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  // Passing tests for menuitemcheckbox role
  it("menuitemcheckbox with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="menuitemcheckbox" aria-label="Show toolbar" aria-checked="true"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("menuitemcheckbox with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <p id="menuitemLabel">Word wrap</p>
        <div role="menuitemcheckbox" aria-labelledby="menuitemLabel" aria-checked="false"></div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  // Passing tests for menuitemradio role
  it("menuitemradio with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="menuitemradio" aria-label="Left align" aria-checked="true"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("menuitemradio with title passes", async () => {
    const container = await fixture(html`
      <div role="menuitemradio" title="Center align" aria-checked="false"></div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  // Failing tests - no accessible name
  it("checkbox without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="checkbox" aria-checked="false"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  it("switch without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="switch" aria-checked="true"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  it("radio without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="radio" aria-checked="false"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  it("menuitemcheckbox without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="menuitemcheckbox" aria-checked="true"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  it("menuitemradio without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="menuitemradio" aria-checked="false"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  // Failing tests - empty accessible name
  it("checkbox with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div role="checkbox" aria-label="  " aria-checked="false"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  it("switch with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div role="switch" aria-labelledby="non-existing" aria-checked="true"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  it("radio with empty title fails", async () => {
    const container = await fixture(html`
      <div role="radio" title=" " aria-checked="false"></div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA toggle fields must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
      },
    ]);
  });

  // Native elements should be ignored
  it("native checkbox input is ignored", async () => {
    const container = await fixture(html`
      <input type="checkbox" />
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("native radio input is ignored", async () => {
    const container = await fixture(html`
      <input type="radio" name="option" />
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  // Multiple elements test
  it("multiple toggle fields with mixed accessible names", async () => {
    const container = await fixture(html`
      <div>
        <div role="checkbox" aria-label="Valid checkbox" aria-checked="false"></div>
        <div role="switch" aria-checked="true"></div>
        <div role="radio" aria-label="Valid radio" aria-checked="false"></div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "ARIA toggle fields must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-toggle-field-name",
    });
  });
});

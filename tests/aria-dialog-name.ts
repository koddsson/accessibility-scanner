import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import ariaDialogName from "../src/rules/aria-dialog-name";

const scanner = new Scanner([ariaDialogName]);

describe("aria-dialog-name", function () {
  it("dialog with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="dialog" aria-label="Settings dialog">
        <p>Dialog content</p>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("alertdialog with aria-label passes", async () => {
    const container = await fixture(html`
      <div role="alertdialog" aria-label="Confirmation required">
        <p>Are you sure?</p>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("dialog with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <h2 id="dialogTitle">User Settings</h2>
        <div role="dialog" aria-labelledby="dialogTitle">
          <p>Dialog content</p>
        </div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("alertdialog with aria-labelledby passes", async () => {
    const container = await fixture(html`
      <div>
        <h2 id="alertTitle">Warning</h2>
        <div role="alertdialog" aria-labelledby="alertTitle">
          <p>This action cannot be undone.</p>
        </div>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("dialog with title attribute passes", async () => {
    const container = await fixture(html`
      <div role="dialog" title="Preferences">
        <p>Dialog content</p>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("alertdialog with title attribute passes", async () => {
    const container = await fixture(html`
      <div role="alertdialog" title="Error occurred">
        <p>An error has occurred.</p>
      </div>
    `);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("dialog without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="dialog">
        <p>Dialog content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("alertdialog without accessible name fails", async () => {
    const container = await fixture(html`
      <div role="alertdialog">
        <p>Alert content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("dialog with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div role="dialog" aria-label="  ">
        <p>Dialog content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("alertdialog with empty aria-label fails", async () => {
    const container = await fixture(html`
      <div role="alertdialog" aria-label="">
        <p>Alert content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("dialog with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div role="dialog" aria-labelledby="non-existing-id">
        <p>Dialog content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("alertdialog with non-existing aria-labelledby fails", async () => {
    const container = await fixture(html`
      <div role="alertdialog" aria-labelledby="missing-label">
        <p>Alert content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("dialog with empty title fails", async () => {
    const container = await fixture(html`
      <div role="dialog" title=" ">
        <p>Dialog content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("alertdialog with empty title fails", async () => {
    const container = await fixture(html`
      <div role="alertdialog" title="">
        <p>Alert content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.eql([
      {
        text: "ARIA dialog and alertdialog nodes must have an accessible name",
        url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
      },
    ]);
  });

  it("native dialog element is ignored", async () => {
    const container = await fixture(html`<dialog>Native dialog content</dialog>`);
    const results = await scanner.scan(container);
    expect(results).to.be.empty;
  });

  it("multiple dialogs with mixed accessible names", async () => {
    const container = await fixture(html`
      <div>
        <div role="dialog" aria-label="Valid dialog">
          <p>First dialog</p>
        </div>
        <div role="alertdialog">
          <p>Second alertdialog without name</p>
        </div>
        <div role="dialog">
          <p>Third dialog without name</p>
        </div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "ARIA dialog and alertdialog nodes must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
    });
    expect(results[1]).to.eql({
      text: "ARIA dialog and alertdialog nodes must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
    });
  });

  it("nested dialogs are each checked separately", async () => {
    const container = await fixture(html`
      <div role="dialog" aria-label="Outer dialog">
        <div role="alertdialog">
          <p>Inner alertdialog without name</p>
        </div>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });
    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "ARIA dialog and alertdialog nodes must have an accessible name",
      url: "https://dequeuniversity.com/rules/axe/4.4/aria-dialog-name?application=RuleDescription",
    });
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import presentationRoleConflict from "../src/rules/presentation-role-conflict";

const scanner = new Scanner([presentationRoleConflict]);

describe("presentation-role-conflict", function () {
  it("passes for div with role=presentation and no conflicts", async () => {
    const element = await fixture(
      html` <div role="presentation">Content</div> `,
    );

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("passes for img with role=none and no conflicts", async () => {
    const element = await fixture(html` <img role="none" src="img.png" /> `);

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("fails for button with role=presentation (natively focusable)", async () => {
    const element = await fixture(
      html` <button role="presentation">Click</button> `,
    );

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: 'Elements with role="none" or role="presentation" must not have conditions that trigger role conflict resolution',
        url: "https://dequeuniversity.com/rules/axe/4.11/presentation-role-conflict",
      },
    ]);
  });

  it("fails for div with role=none and aria-label", async () => {
    const element = await fixture(
      html` <div role="none" aria-label="Label">Content</div> `,
    );

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: 'Elements with role="none" or role="presentation" must not have conditions that trigger role conflict resolution',
        url: "https://dequeuniversity.com/rules/axe/4.11/presentation-role-conflict",
      },
    ]);
  });

  it("fails for div with role=presentation and tabindex=0", async () => {
    const element = await fixture(
      html` <div role="presentation" tabindex="0">Content</div> `,
    );

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: 'Elements with role="none" or role="presentation" must not have conditions that trigger role conflict resolution',
        url: "https://dequeuniversity.com/rules/axe/4.11/presentation-role-conflict",
      },
    ]);
  });

  it("fails for a[href] with role=none (natively focusable)", async () => {
    const element = await fixture(
      html` <a href="#" role="none">Link</a> `,
    );

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: 'Elements with role="none" or role="presentation" must not have conditions that trigger role conflict resolution',
        url: "https://dequeuniversity.com/rules/axe/4.11/presentation-role-conflict",
      },
    ]);
  });

  it("passes for div with role=none and tabindex=-1", async () => {
    const element = await fixture(
      html` <div role="none" tabindex="-1">Content</div> `,
    );

    const results = (await scanner.scan(element)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

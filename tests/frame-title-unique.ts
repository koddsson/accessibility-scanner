import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import frameTitleUnique from "../src/rules/frame-title-unique";

const scanner = new Scanner([frameTitleUnique]);

describe("frame-title-unique", function () {
  describe("has no errors if", function () {
    it("iframes have unique titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Frame 1" src="about:blank"></iframe>
          <iframe title="Frame 2" src="about:blank"></iframe>
          <iframe title="Frame 3" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("frames have unique titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Frame 1" src="about:blank"></iframe>
          <iframe title="Frame 2" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("mixed iframes and frames have unique titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="IFrame 1" src="about:blank"></iframe>
          <iframe title="Frame 1" src="about:blank"></iframe>
          <iframe title="IFrame 2" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("frames don't have title attributes", async () => {
      const container = await fixture(html`
        <div>
          <iframe src="about:blank"></iframe>
          <iframe src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("frames have empty titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="" src="about:blank"></iframe>
          <iframe title="" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("only one frame has a title", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Unique Title" src="about:blank"></iframe>
          <iframe src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.be.empty;
    });

    it("titles differ only in leading/trailing whitespace are treated as the same (normalized)", async () => {
      // This test verifies that titles are normalized (trimmed)
      // so "Title" and " Title " are considered the same
      const container = await fixture(html`
        <div>
          <iframe title="Title" src="about:blank"></iframe>
          <iframe title="  Title  " src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });
  });

  describe("has errors if", function () {
    it("two iframes have the same title", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Duplicate Title" src="about:blank"></iframe>
          <iframe title="Duplicate Title" src="about:blank"></iframe>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results).to.eql([
        {
          text: "Frames must have a unique title attribute",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title-unique",
        },
        {
          text: "Frames must have a unique title attribute",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title-unique",
        },
      ]);
    });

    it("two frames have the same title", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Same Title" src="about:blank"></iframe>
          <iframe title="Same Title" src="about:blank"></iframe>
        </div>
      `);

      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
      expect(results).to.eql([
        {
          text: "Frames must have a unique title attribute",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title-unique",
        },
        {
          text: "Frames must have a unique title attribute",
          url: "https://dequeuniversity.com/rules/axe/4.4/frame-title-unique",
        },
      ]);
    });

    it("multiple iframes have the same title", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Common Title" src="about:blank"></iframe>
          <iframe title="Common Title" src="about:blank"></iframe>
          <iframe title="Common Title" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(3);
    });

    it("mixed iframes and frames have the same title", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Shared Title" src="about:blank"></iframe>
          <iframe title="Shared Title" src="about:blank"></iframe>
          <iframe title="Shared Title" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(3);
    });

    it("some frames have duplicate titles while others are unique", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Unique 1" src="about:blank"></iframe>
          <iframe title="Duplicate" src="about:blank"></iframe>
          <iframe title="Duplicate" src="about:blank"></iframe>
          <iframe title="Unique 2" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(2);
    });

    it("multiple sets of duplicate titles", async () => {
      const container = await fixture(html`
        <div>
          <iframe title="Group A" src="about:blank"></iframe>
          <iframe title="Group A" src="about:blank"></iframe>
          <iframe title="Group B" src="about:blank"></iframe>
          <iframe title="Group B" src="about:blank"></iframe>
        </div>
      `);

      const results = await scanner.scan(container);
      expect(results).to.have.lengthOf(4);
    });
  });
});

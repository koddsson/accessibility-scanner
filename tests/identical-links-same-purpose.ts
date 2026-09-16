import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import identicalLinksSamePurpose from "../src/rules/identical-links-same-purpose";

const scanner = new Scanner([identicalLinksSamePurpose]);

describe("identical-links-same-purpose", function () {
  describe("returns errors if", function () {
    it("two links have the same text but different hrefs", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
          <a href="/page2">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.eql({
        text: "Links with the same accessible name should have a similar purpose",
        url: "https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose",
      });
    });

    it("links with same aria-label but different hrefs", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1" aria-label="Read more">Link 1</a>
          <a href="/page2" aria-label="Read more">Link 2</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(1);
      expect(results[0]).to.eql({
        text: "Links with the same accessible name should have a similar purpose",
        url: "https://dequeuniversity.com/rules/axe/4.11/identical-links-same-purpose",
      });
    });

    it("marks results as needing review", async () => {
      const element = await fixture(html`
        <div>
          <a href="/devices?ids=1,2,3">3 Devices</a>
          <a href="/devices?ids=4,5,6">3 Devices</a>
        </div>
      `);

      const results = await scanner.scan(element);

      expect(results).to.have.lengthOf(1);
      expect(results[0].needsReview).to.be.true;
    });

    it("compares the accessible name rather than raw text content", async () => {
      const element = await fixture(html`
        <div>
          <a href="/users">Users</a>
          <a href="/settings/users">Users <span aria-hidden="true">3</span></a>
          <a href="/all-users"><img src="x.png" alt="Users" /></a>
          <span id="lbl">Users</span>
          <a href="/other-users" aria-labelledby="lbl">Ignored text</a>
        </div>
      `);

      const results = await scanner.scan(element);

      expect(results).to.have.lengthOf(3);
    });

    it("elements with role=link and no href have an unknown target", async () => {
      const element = await fixture(html`
        <div>
          <span role="link" tabindex="0">Contact</span>
          <a href="/contact">Contact</a>
        </div>
      `);

      const results = await scanner.scan(element);

      expect(results).to.have.lengthOf(1);
      expect(results[0].needsReview).to.be.true;
    });

    it("multiple links with same text but different hrefs flags all duplicates", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
          <a href="/page2">Click here</a>
          <a href="/page3">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.have.lengthOf(2);
    });
  });

  describe("does not return errors if", function () {
    it("two links have the same text and same href", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
          <a href="/page1">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("hrefs differ textually but resolve to the same URL", async () => {
      const element = await fixture(html`
        <div>
          <a href="/settings/users">Users</a>
          <a href="${location.origin}/settings/users">Users</a>
          <a href="/settings/users/">Users</a>
          <a href="/settings/users/index.html">Users</a>
        </div>
      `);

      const results = await scanner.scan(element);

      expect(results).to.be.empty;
    });

    it("visible badge text differs but the accessible name is the same", async () => {
      const element = await fixture(html`
        <div>
          <a href="/users">Users <span>3</span></a>
          <a href="/users">Users <span>4</span></a>
          <a href="/users" aria-label="Users">Members</a>
        </div>
      `);

      const results = await scanner.scan(element);

      expect(results).to.be.empty;
    });

    it("links have different text", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Go to page 1</a>
          <a href="/page2">Go to page 2</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("there is only a single link", async () => {
      const element = await fixture(html`
        <div>
          <a href="/page1">Click here</a>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("anchors have a role other than link", async () => {
      const element = await fixture(html`
        <div>
          <nav><a href="/users">Users</a></nav>
          <ul role="tablist">
            <li role="presentation">
              <a href="?tab=users" role="tab" aria-selected="true">Users</a>
            </li>
            <li role="presentation">
              <a href="?tab=groups" role="tab">Groups</a>
            </li>
          </ul>
          <a href="/open" role="button">Users</a>
        </div>
      `);

      const results = await scanner.scan(element);

      expect(results).to.be.empty;
    });

    it("there are no links", async () => {
      const element = await fixture(html`
        <div>
          <p>No links here</p>
        </div>
      `);

      const results = (await scanner.scan(element)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});

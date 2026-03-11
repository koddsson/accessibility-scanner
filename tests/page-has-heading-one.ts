import { expect, fixture, html, nextFrame } from "@open-wc/testing";
import { scan } from "../src/scanner";
import pageHasHeadingOne from "../src/rules/page-has-heading-one";

describe("page-has-heading-one", function () {
  describe("has no errors if", function () {
    it("page contains an h1 element", async () => {
      const iframe = (await fixture(
        html`<iframe
          srcdoc="<!DOCTYPE html><html><body><h1>Main Heading</h1><p>Content</p></body></html>"
        ></iframe>`,
      )) as HTMLIFrameElement;
      await nextFrame();
      const container = iframe.contentDocument!.querySelector("html")!;

      const results = await scan(container, [pageHasHeadingOne]);

      expect(results).to.be.empty;
    });

    it("page contains a role=heading with aria-level=1", async () => {
      const iframe = (await fixture(
        html`<iframe
          srcdoc='<!DOCTYPE html><html><body><div role="heading" aria-level="1">Main Heading</div></body></html>'
        ></iframe>`,
      )) as HTMLIFrameElement;
      await nextFrame();
      const container = iframe.contentDocument!.querySelector("html")!;

      const results = await scan(container, [pageHasHeadingOne]);

      expect(results).to.be.empty;
    });

    it("h1 is nested inside other elements", async () => {
      const iframe = (await fixture(
        html`<iframe
          srcdoc="<!DOCTYPE html><html><body><div><section><h1>Nested</h1></section></div></body></html>"
        ></iframe>`,
      )) as HTMLIFrameElement;
      await nextFrame();
      const container = iframe.contentDocument!.querySelector("html")!;

      const results = await scan(container, [pageHasHeadingOne]);

      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("page contains only an h2 element", async () => {
      const iframe = (await fixture(
        html`<iframe
          srcdoc="<!DOCTYPE html><html><body><h2>Secondary</h2></body></html>"
        ></iframe>`,
      )) as HTMLIFrameElement;
      await nextFrame();
      const container = iframe.contentDocument!.querySelector("html")!;

      const results = (await scan(container, [pageHasHeadingOne])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Page should contain a level-one heading",
      );
      expect(results[0].url).to.include("page-has-heading-one");
    });

    it("page has no headings", async () => {
      const iframe = (await fixture(
        html`<iframe
          srcdoc="<!DOCTYPE html><html><body></body></html>"
        ></iframe>`,
      )) as HTMLIFrameElement;
      await nextFrame();
      const container = iframe.contentDocument!.querySelector("html")!;

      const results = (await scan(container, [pageHasHeadingOne])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.have.lengthOf(1);
      expect(results[0].text).to.equal(
        "Page should contain a level-one heading",
      );
    });
  });
});

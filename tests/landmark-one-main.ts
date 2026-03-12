import { expect, fixture, html } from "@open-wc/testing";
import { scan } from "../src/scanner";
import landmarkOneMain from "../src/rules/landmark-one-main";

/**
 * Create a `<html></html>` in a iframe so that we aren't using the `<html>` element of the test runner.
 */
async function createHTMLElement(htmlString: string): Promise<HTMLElement> {
  const iframe = (await fixture(
    html`<iframe srcdoc="<!DOCTYPE html>${htmlString}"></iframe>`,
  )) as HTMLIFrameElement;

  // Wait for the iframe to finish loading its srcdoc content before accessing the document.
  await new Promise<void>((resolve) => {
    if (iframe.contentDocument?.readyState === "complete") {
      resolve();
    } else {
      iframe.addEventListener("load", () => resolve(), { once: true });
    }
  });

  return iframe.contentDocument!.querySelector("html")!;
}

describe("landmark-one-main", function () {
  describe("has no errors if", function () {
    it("page has a <main> element", async () => {
      const container = await createHTMLElement(
        "<html><body><main><h1>Main Content</h1></main></body></html>",
      );

      const results = await scan(container, [landmarkOneMain]);
      expect(results).to.be.empty;
    });

    it('page has an element with role="main"', async () => {
      const container = await createHTMLElement(
        '<html><body><div role="main"><h1>Main Content</h1></div></body></html>',
      );

      const results = await scan(container, [landmarkOneMain]);
      expect(results).to.be.empty;
    });

    it('page has both <main> and role="main"', async () => {
      const container = await createHTMLElement(
        '<html><body><main><h1>Main Content</h1></main><div role="main"><h1>Other Main</h1></div></body></html>',
      );

      const results = await scan(container, [landmarkOneMain]);
      expect(results).to.be.empty;
    });
  });

  describe("has errors if", function () {
    it("page has no main landmark", async () => {
      const container = await createHTMLElement(
        "<html><body><div><h1>Content without main</h1></div></body></html>",
      );

      const results = (await scan(container, [landmarkOneMain])).map(
        ({ text, url }) => {
          return { text, url };
        },
      );

      expect(results).to.eql([
        {
          text: "Document should have one main landmark",
          url: "https://dequeuniversity.com/rules/axe/4.11/landmark-one-main",
        },
      ]);
    });
  });
});

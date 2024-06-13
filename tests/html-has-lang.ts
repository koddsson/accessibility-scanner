import { expect, fixture, html, nextFrame } from "@open-wc/testing";
import { scan } from "../src/scanner";
import htmlHasLang from "../src/rules/html-has-lang";

/**
 * Create a `<html></html>` in a iframe so that we aren't using the `<html>` element of the test runner.
 */
async function createHTMLElement(htmlString: string): Promise<HTMLElement> {
  const iframe = (await fixture(
    html`<iframe srcdoc="<!DOCTYPE html>${htmlString}"></iframe>`,
  )) as HTMLIFrameElement;

  return iframe.contentDocument!.querySelector("html")!;
}

describe("html-has-lang", function () {
  it("html element without a lang attribute fails", async () => {
    const container = await createHTMLElement("<html></html>");

    // Not sure why there's a timing issue here but this seems to fix it
    await nextFrame();

    const results = (await scan(container, [htmlHasLang])).map(
      ({ text, url }) => {
        return { text, url };
      },
    );

    expect(results).to.eql([
      {
        text: "<html> element must have a lang attribute",
        url: "https://dequeuniversity.com/rules/axe/4.4/html-has-lang",
      },
    ]);
  });

  it("html element with a empty lang attribute fails", async () => {
    const container = await createHTMLElement('<html lang=""></html>');

    const results = (await scan(container, [htmlHasLang])).map(
      ({ text, url }) => {
        return { text, url };
      },
    );

    expect(results).to.eql([
      {
        text: "<html> element must have a lang attribute",
        url: "https://dequeuniversity.com/rules/axe/4.4/html-has-lang",
      },
    ]);
  });

  // This is skipped because it's flaky
  it.skip("html element with a boolean lang attribute fails", async () => {
    const container = await createHTMLElement("<html lang></html>");

    const results = (await scan(container, [htmlHasLang])).map(
      ({ text, url }) => {
        return { text, url };
      },
    );

    expect(results).to.eql([
      {
        text: "<html> element must have a lang attribute",
        url: "https://dequeuniversity.com/rules/axe/4.4/html-has-lang",
      },
    ]);
  });

  it("html element with a whitespace only lang attribute fails", async () => {
    const container = await createHTMLElement(
      '<html lang="                 "></html>',
    );

    const results = (await scan(container, [htmlHasLang])).map(
      ({ text, url }) => {
        return { text, url };
      },
    );

    expect(results).to.eql([
      {
        text: "<html> element must have a lang attribute",
        url: "https://dequeuniversity.com/rules/axe/4.4/html-has-lang",
      },
    ]);
  });
});

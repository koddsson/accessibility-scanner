import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import metaRefreshNoExceptions from "../src/rules/meta-refresh-no-exceptions";

const scanner = new Scanner([metaRefreshNoExceptions]);

/**
 * Create a meta element inside a sandboxed iframe to prevent the browser from
 * actually executing the meta refresh directive during testing.
 * The sandbox="allow-same-origin" allows accessing the iframe's contentDocument
 * while still blocking meta refresh navigation.
 */
async function createMetaRefreshElement(
  metaHtml: string,
): Promise<HTMLMetaElement> {
  const iframe = (await fixture(
    html`<iframe
      sandbox="allow-same-origin"
      srcdoc="<!DOCTYPE html><html><head>${metaHtml}</head><body></body></html>"
    ></iframe>`,
  )) as HTMLIFrameElement;

  await new Promise<void>((resolve) => {
    if (iframe.contentDocument?.readyState === "complete") {
      resolve();
    } else {
      iframe.addEventListener("load", () => resolve(), { once: true });
    }
  });

  return iframe.contentDocument!.querySelector("meta")!;
}

describe("meta-refresh-no-exceptions", function () {
  it("does not return errors when meta refresh has delay of 0", async () => {
    const meta = await createMetaRefreshElement(
      '<meta http-equiv="refresh" content="0" />',
    );

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors when meta refresh has a non-zero delay", async () => {
    const meta = await createMetaRefreshElement(
      '<meta http-equiv="refresh" content="3000" />',
    );

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Delayed refresh under 20 hours must not be used",
        url: "https://dequeuniversity.com/rules/axe/4.11/meta-refresh-no-exceptions",
      },
    ]);
  });

  it("does not return errors when meta refresh has delay of 0 with URL redirect", async () => {
    const meta = await createMetaRefreshElement(
      '<meta http-equiv="refresh" content="0;url=https://example.com" />',
    );

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("returns errors when meta refresh has a large delay", async () => {
    const meta = await createMetaRefreshElement(
      '<meta http-equiv="refresh" content="72000" />',
    );

    const results = (await scanner.scan(meta)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Delayed refresh under 20 hours must not be used",
        url: "https://dequeuniversity.com/rules/axe/4.11/meta-refresh-no-exceptions",
      },
    ]);
  });

  it("does not return errors when there is no meta refresh element", async () => {
    const div = await fixture(html` <div>No meta here</div> `);

    const results = (await scanner.scan(div)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import audioCaption from "../src/rules/audio-caption";

const scanner = new Scanner([audioCaption]);

describe("audio-caption", function () {
  it("audio elements without a track return errors", async () => {
    const container = await fixture(html`<audio></audio>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        "text": "<audio> elements must have a captions <track>",
        "url": "https://dequeuniversity.com/rules/axe/4.4/audio-caption"
      },
    ]);
  });
  
  it("audio elements with a track returns no errors", async () => {
    const container = await fixture(html`<audio><track kind="captions" /></audio>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty
  });
});

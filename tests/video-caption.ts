import { fixture, html, expect } from "@open-wc/testing";
import { scan } from "../src/scanner";

describe("video-caption", function () {
  it("video elements without a track return errors", async () => {
    const container = await fixture(html`<video></video>`);
    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<video> elements must have a <track> for captions",
        url: "https://dequeuniversity.com/rules/axe/4.4/video-caption?application=RuleDescription",
      },
    ]);
  });

  it("video elements without a wrong kind of track return errors", async () => {
    const container = await fixture(
      html`<video><track kind="descriptions" /></video>`
    );
    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<video> elements must have a <track> for captions",
        url: "https://dequeuniversity.com/rules/axe/4.4/video-caption?application=RuleDescription",
      },
    ]);
  });

  it("video elements with a track returns no errors", async () => {
    const container = await fixture(
      html`<video><track kind="captions" /></video>`
    );
    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("video elements without multiple tracks but at least one caption track returns no errors", async () => {
    const container = await fixture(
      html`<video id="pass2">
        <track kind="descriptions" />
        <track kind="captions" />
      </video>`
    );
    const results = (await scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "<video> elements must have a <track> for captions",
        url: "https://dequeuniversity.com/rules/axe/4.4/video-caption?application=RuleDescription",
      },
    ]);
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { scan } from "../src/scanner";

describe("video-caption", function () {
  it("video elements without a track return errors", async () => {
    const container = await fixture(html`<video></video>`)
    const results = (await scan(container)).map(({text, url}) => {
      return {text, url}
    })

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  })

  it("video elements without a track return errors", async () => {
    const container = await fixture(html`<video><track kind="descriptions" /></video>`)
    const results = (await scan(container)).map(({text, url}) => {
      return {text, url}
    })

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  })

  it("video elements without a track return errors", async () => {
    const container = await fixture(html`<video><track kind="captions" /></video>`)
    const results = (await scan(container)).map(({text, url}) => {
      return {text, url}
    })

    expect(results).to.be.empty
  })

  it("video elements without a track return errors", async () => {
    const container = await fixture(html`<video id="pass2"><track kind="descriptions" /><track kind="captions" /></video>`)
    const results = (await scan(container)).map(({text, url}) => {
      return {text, url}
    })

    expect(results).to.eql([
      {
        text: "Elements must only use allowed ARIA attributes",
        url: "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription",
      },
    ]);
  })
})

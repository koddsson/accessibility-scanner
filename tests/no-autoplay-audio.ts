import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import noAutoplayAudio from "../src/rules/no-autoplay-audio";

const scanner = new Scanner([noAutoplayAudio]);

describe("no-autoplay-audio", function () {
  it("audio element with autoplay and no controls returns error", async () => {
    const container = await fixture(html`<audio autoplay></audio>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio",
        url: "https://dequeuniversity.com/rules/axe/4.4/no-autoplay-audio?application=RuleDescription",
      },
    ]);
  });

  it("audio element with autoplay and controls returns no error", async () => {
    const container = await fixture(
      html`<audio autoplay controls></audio>`
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("audio element with autoplay and muted returns no error", async () => {
    const container = await fixture(html`<audio autoplay muted></audio>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("audio element without autoplay returns no error", async () => {
    const container = await fixture(html`<audio></audio>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("video element with autoplay and no controls returns error", async () => {
    const container = await fixture(html`<video autoplay></video>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.eql([
      {
        text: "Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio",
        url: "https://dequeuniversity.com/rules/axe/4.4/no-autoplay-audio?application=RuleDescription",
      },
    ]);
  });

  it("video element with autoplay and controls returns no error", async () => {
    const container = await fixture(
      html`<video autoplay controls></video>`
    );
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("video element with autoplay and muted returns no error", async () => {
    const container = await fixture(html`<video autoplay muted></video>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("video element without autoplay returns no error", async () => {
    const container = await fixture(html`<video></video>`);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });

  it("multiple audio elements with autoplay and no controls return multiple errors", async () => {
    const container = await fixture(html`
      <div>
        <audio autoplay></audio>
        <audio autoplay></audio>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(2);
    expect(results[0]).to.eql({
      text: "Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio",
      url: "https://dequeuniversity.com/rules/axe/4.4/no-autoplay-audio?application=RuleDescription",
    });
  });

  it("mixed audio and video elements with autoplay return errors", async () => {
    const container = await fixture(html`
      <div>
        <audio autoplay></audio>
        <video autoplay></video>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(2);
  });

  it("audio element with autoplay in nested structure returns error", async () => {
    const container = await fixture(html`
      <div>
        <section>
          <audio autoplay></audio>
        </section>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.have.lengthOf(1);
    expect(results[0]).to.eql({
      text: "Ensures <video> or <audio> elements do not autoplay audio for more than 3 seconds without a control mechanism to stop or mute the audio",
      url: "https://dequeuniversity.com/rules/axe/4.4/no-autoplay-audio?application=RuleDescription",
    });
  });

  it("no errors when no audio or video elements present", async () => {
    const container = await fixture(html`
      <div>
        <p>Normal content</p>
      </div>
    `);
    const results = (await scanner.scan(container)).map(({ text, url }) => {
      return { text, url };
    });

    expect(results).to.be.empty;
  });
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import frameFocusableContent from "../src/rules/frame-focusable-content";

const scanner = new Scanner([frameFocusableContent]);

const expectedError = {
  text: "Frames with focusable content must not have tabindex=-1",
  url: "https://dequeuniversity.com/rules/axe/4.4/frame-focusable-content?application=RuleDescription",
};

// Helper to wait for iframe to be fully loaded with polling
async function waitForIframeLoad(iframe: HTMLIFrameElement): Promise<void> {
  const timeout = 2000; // 2 second timeout
  const pollInterval = 50; // Check every 50ms
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const checkIframeReady = () => {
      // Check if iframe content is accessible and ready
      // For srcdoc iframes, contentDocument and body should be available even if readyState isn't 'complete'
      if (
        iframe.contentDocument &&
        iframe.contentDocument.body
      ) {
        // Give it one more tick to ensure any dynamic content is rendered
        setTimeout(resolve, 10);
        return;
      }

      // Check if we've exceeded the timeout
      if (Date.now() - startTime >= timeout) {
        reject(new Error('Timeout waiting for iframe to load'));
        return;
      }

      // Poll again after interval
      setTimeout(checkIframeReady, pollInterval);
    };

    // Start checking
    checkIframeReady();
  });
}

describe("frame-focusable-content", function () {
  describe("has errors if", function () {
    it("iframe with tabindex=-1 contains a link", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<a href='#'>Link</a>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([expectedError]);
    });

    it("iframe with tabindex=-1 contains a button", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<button>Click me</button>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([expectedError]);
    });

    it("iframe with tabindex=-1 contains an input", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<input type='text'>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([expectedError]);
    });

    it("iframe with tabindex=-1 contains a select", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<select><option>Option</option></select>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([expectedError]);
    });

    it("iframe with tabindex=-1 contains a textarea", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<textarea></textarea>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([expectedError]);
    });

    it("iframe with tabindex=-1 contains element with positive tabindex", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<div tabindex='0'>Focusable div</div>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([expectedError]);
    });
  });

  describe("has no errors if", function () {
    it("iframe without tabindex contains focusable content", async () => {
      const container = await fixture(html`
        <iframe srcdoc="<a href='#'>Link</a>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("iframe with tabindex=0 contains focusable content", async () => {
      const container = await fixture(html`
        <iframe tabindex="0" srcdoc="<a href='#'>Link</a>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("iframe with tabindex=-1 without focusable content", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<p>Just text</p>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("iframe with tabindex=-1 contains only elements with tabindex=-1", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<a href='#' tabindex='-1'>Link</a>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("iframe with tabindex=-1 contains only disabled form controls", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<button disabled>Click me</button>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("iframe with tabindex=-1 contains only hidden elements", async () => {
      const container = await fixture(html`
        <iframe tabindex="-1" srcdoc="<a href='#' style='display: none;'>Link</a>"></iframe>
      `);
      
      const iframe = (container.querySelector('iframe') || container) as HTMLIFrameElement;
      await waitForIframeLoad(iframe);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });

    it("does not check non-iframe elements", async () => {
      const container = await fixture(html`
        <div tabindex="-1">
          <a href="#">Link</a>
        </div>
      `);
      
      const results = (await scanner.scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  });
});

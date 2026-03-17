import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[80f0bf]Audio or video element avoids automatically playing audio", function () {
  it.skip("Passed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/80f0bf/29ea904ef03f14401a7b43a5ffc9b30271697bc7.html)", async () => {
    const document = parser.parseFromString(`<!DOCTYPE html>
<html lang="en">
<head>
	<style>
		button {
			color: #000;
		}
		button:hover {
			cursor: pointer;
			cursor: pointer;
			background-color: grey;
			color: white;
		}
	</style>
</head>
<body>
	<div id="video-container">
		<!-- Video -->
		<video id="video" autoplay>
			<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.mp4" type="video/mp4" />
			<source src="/WAI/content-assets/wcag-act-rules/test-assets/rabbit-video/video.webm" type="video/webm" />
		</video>
		<!-- Video Controls -->
		<div id="video-controls">
			<button type="button" id="play-pause" class="play">Play</button>
			<button type="button" id="mute">Mute</button>
		</div>
	</div>
	<script src="/WAI/content-assets/wcag-act-rules/test-assets/80f0bf/no-autoplay.js"></script>
</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/no-autoplay-audio"];
    const relevant = results.filter(r => expectedUrls.includes(r.url));
    expect(relevant).to.be.empty;
  });
});

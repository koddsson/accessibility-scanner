import { expect } from "@open-wc/testing";
import { cleanup, render } from "../../render.js";
import { scan } from "../../../../src/scanner.js";

describe("[b4f0c3]Meta viewport allows for zoom", function () {
  afterEach(cleanup);

  it("Failed Example 3 (https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/c94a59f8c3b17d722781af36da3556ff4b418776.html)", async () => {
    const document = await render(`<!DOCTYPE html>
<html>
	<head>
		<title>Simple page showing random text</title>
		<meta name="viewport" content="user-scalable=invalid" />
	</head>
	<body>
		<p>
			Lorem ipsum
		</p>
	</body>
</html>`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url, needsReview }) => {
      return { text, url, needsReview };
    });

    expect(results).to.not.be.empty;
    const expectedUrls = ["https://dequeuniversity.com/rules/axe/4.11/meta-viewport"];
    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;
  });
});

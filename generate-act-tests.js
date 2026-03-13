import { mkdir, writeFile, readFile, rm } from "node:fs/promises";

// Clean up previously generated test files to remove stale tests
// when rules are added to the ignore list or test cases are removed.
await rm("./tests/act/tests/", { recursive: true, force: true });

const { testcases } = JSON.parse(await readFile("./testcases.json", "utf8"));
const rulesData = JSON.parse(await readFile("./rules.json", "utf8"));

// Build a mapping from ACT rule ID to the set of scanner rule URLs that
// reference it.  Each entry in rules.json can list one-or-more ACT rule IDs
// inside its "ACT Rules" field (markdown links like "[id](url)").  The scanner
// error URL for a rule is its `url` field without the query string.
const actRuleIdToExpectedUrls = {};
for (const section of Object.values(rulesData)) {
  for (const rule of section.rules) {
    const actField = rule["ACT Rules"];
    if (!actField) continue;
    // Extract all ACT rule IDs from markdown links like [5c01ea](...)
    const matches = [...actField.matchAll(/\[([^\]]+)\]/g)];
    for (const m of matches) {
      const actId = m[1];
      if (!actRuleIdToExpectedUrls[actId]) {
        actRuleIdToExpectedUrls[actId] = [];
      }
      // Strip ?application=RuleDescription from the URL
      const cleanUrl = rule.url.replace(/\?.*$/, "");
      if (!actRuleIdToExpectedUrls[actId].includes(cleanUrl)) {
        actRuleIdToExpectedUrls[actId].push(cleanUrl);
      }
    }
  }
}

const applicableRules = testcases.filter(
  (rule) => rule.ruleAccessibilityRequirements,
);

const testCasesThatRedirect = [
  "0ae68e88f61e1bc6cc56f7a4ae1bcf852d68cde2",
  "0c9b0abdee645fa6145f02913a76e809a244708d",
  "0cf51395718454dabba4bbad975f41fd51f33f4a",
  "1ecaa280edc88898e1023c0470fd71eb105f6cf9",
  "2cf5502b5807593934392d51f7500b0637a83d81",
  "4a37117137ddae558eb09d671f605fa2ad8d5367",
  "4f9bb0a8ab7bd76505483c47da831440b864fe50",
  "84b7a46e7e9cb736cc9327bce10240e943801ba6",
  "95f01f2edc22df2794ea7f606f7fb855f1e2dc67",
  "293add8170d86d1f418c0620470920105003da42",
  "329cba6f6b7fa215ae1e8006de9263570b91c11d",
  "26966d81745c8ab45553c3c305eacba632f4b11f",
  "371137ff8848c11ce6db9252bfe8e4bd3b2690d9",
  "1812017f58925ef5061af2f60c68afa671281c91",
  "459353149c69b2ee77944c5641cbff66396829e0",
  "459353149c69b2ee77944c5641cbff66396829e0",
  "a1a1550e2be737918ba96c4cc7237060515ef8cb",
  "af2a6e7b7e607d0cfeff0f70a1f9ab6330ba50a4",
  "bcf969320f87281ac6e996b1725e5633f1255863",
  "beeaf6f49d37ef2d771effd40bcb3bfc9655fbf4",
  "beeaf6f49d37ef2d771effd40bcb3bfc9655fbf4",
  "c8ed0642698f8e519b0939501cb37fabcd7c253f",
  "cbf6409b0df0b3b6437ab3409af341587b144969",
  "d1bbcc895f6e11010b033578d073138e7c4fc57e",
  "d789ff3d0c087c77117a02527e71a646a343d4a3",
  "d789ff3d0c087c77117a02527e71a646a343d4a3",
  "ea38668c1bdc61887bfe64ec47ba83a4e2713da9",
  "efd32f45d51c3f3e97a7449a6f4f348c9f4106a8",
  "f2a48cafddd30c8b9a918fe0fe664c44db253b0d",
  "f2a48cafddd30c8b9a918fe0fe664c44db253b0d",
  "ffa9d5785ba84df4dfacbafc5fdb8b82a365f5b4",
];

const rulesToIgnore = [
  // --- Requires visual rendering / computed styles ---
  "047fe0", // Document Heading - requires heading structure analysis beyond current scope
  "09o5cg", // Text Contrast - requires computed styles for color contrast calculation
  "0ssw9k", // Scrollable element - requires computed styles to detect scrollability
  "0va7u6", // Image contains text - requires visual rendering to detect text in images
  "24afc2", // Important letter spacing in style attributes is wide enough - requires computed styles
  "59br37", // Zoomed text node is not clipped with CSS overflow - requires visual rendering
  "78fd32", // Important line height in style attributes is wide enough - requires computed styles
  "9e45ec", // Important word spacing in style attributes is wide enough - requires computed styles
  "afw4f7", // Text has minimum contrast - requires computed styles for color contrast calculation
  "b33eff", // Orientation of the page is not restricted using CSS transforms - requires computed styles
  "oj04fd", // Element in sequential focus order has visible focus - requires visual rendering

  // --- Requires media playback ---
  "1a02b0", // Audio and visuals of video element have transcript - requires media playback
  "1ea59c", // Video element visual content has audio description - requires media playback
  "1ec09b", // Video element visual content has strict accessible alternative - requires media playback
  "4c31df", // Audio or video element that plays automatically has a control mechanism - requires media playback
  "80f0bf", // Audio or video element avoids automatically playing audio - requires media playback
  "aaa1bf", // Audio or video element that plays automatically has no audio that lasts more than 3 seconds - requires media playback
  "c3232f", // Video element visual-only content has accessible alternative - requires media playback
  "c5a4ea", // Video element visual content has accessible alternative - requires media playback
  "d7ba54", // Video element visual-only content has audio track alternative - requires media playback
  "e7aa44", // Audio element content has text alternative - requires media playback
  "ee13b5", // Video element visual-only content has transcript - requires media playback
  "f51b46", // Video element auditory content has captions - requires media playback

  // --- Requires keyboard interaction ---
  "80af7b", // Focusable element has no keyboard trap - requires keyboard interaction
  "ffbc54", // No keyboard shortcut uses only printable characters - requires keyboard interaction

  // --- Requires device interaction ---
  "7677a9", // Device motion based changes to the content can also be created from the user interface - requires device motion events
  "c249d5", // Device motion based changes to the content can be disabled - requires device motion events

  // --- Not implemented - accessible name computation not yet fully supported ---
  "23a2a8", // Image has non-empty accessible name - not implemented
  "59796f", // Image button has non-empty accessible name - not implemented
  "7d6734", // SVG element with explicit role has non-empty accessible name - not implemented
  "8fc3b6", // Object element rendering non-text content has non-empty accessible name - not implemented
  "97a4e1", // Button has non-empty accessible name - not implemented
  "cae760", // Iframe element has non-empty accessible name - not implemented
  "e086e5", // Form field has non-empty accessible name - not implemented
  "ffd0e9", // Heading has non-empty accessible name - not implemented
  "m6b1q3", // Menuitem has non-empty accessible name - not implemented

  // --- Not implemented - ARIA rules not yet fully supported ---
  "4e8ab6", // Element with role attribute has required states and properties - not implemented
  "5c01ea", // ARIA state or property is permitted - not implemented
  "674b10", // Role attribute has valid value - not implemented
  "6a7281", // ARIA state or property has valid value - not implemented
  "6cfa84", // Element with aria-hidden has no content in sequential focus navigation - not implemented
  "bc4a75", // ARIA required owned elements - not implemented
  "ff89c9", // ARIA required context role - not implemented
  "307n5z", // Element with presentational children has no focusable content - not implemented

  // --- Not implemented - link and form rules ---
  "5effbb", // Link in context is descriptive - not implemented, requires human judgment
  "aizyf1", // Link is descriptive - not implemented, requires human judgment
  "b20e66", // Links with identical accessible names have equivalent purpose - not implemented
  "fd3a94", // Links with identical accessible names and same context serve equivalent purpose - not implemented
  "36b590", // Error message describes invalid form field value - not implemented
  "cc0f0a", // Form field label is descriptive - not implemented, requires human judgment

  // --- Not implemented - page-level and structural rules ---
  "2779a5", // HTML page has non-empty title - not implemented in ACT test format
  "b5c3f8", // HTML page has lang attribute - not implemented in ACT test format
  "bf051a", // HTML page lang attribute has valid language tag - not implemented in ACT test format
  "off6ek", // HTML element language subtag matches language - not implemented
  "ucwvc8", // HTML page language subtag matches default language - not implemented
  "c4a8a4", // HTML page title is descriptive - not implemented, requires human judgment
  "cf77f2", // Bypass Blocks of Repeated Content - not implemented
  "ye5d6e", // Document has an instrument to move focus to non-repeated content - not implemented
  "3e12e1", // Block of repeated content is collapsible - not implemented

  // --- Not implemented - various other rules ---
  "2ee8b8", // Visible label is part of accessible name - not implemented
  "73f2c2", // Autocomplete attribute has valid value - not implemented in ACT test format
  "a25f45", // Headers attribute specified on a cell refers to cells in the same table element - not implemented
  "d0f69e", // Table header cell has assigned cells - not implemented
  "b4f0c3", // Meta viewport allows for zoom - not implemented in ACT test format
  "4b1c6c", // Iframe elements with identical accessible names have equivalent purpose - not implemented
  "akn7bn", // Iframe with interactive elements is not excluded from tab-order - not implemented
  "e88epe", // Image not in the accessibility tree is decorative - not implemented
  "b49b2e", // Heading is descriptive - not implemented, requires human judgment
  "9bd38c", // Content has alternative for visual reference - not implemented, requires human judgment
  "efbfc7", // Text content that changes automatically can be paused, stopped or hidden - not implemented

  // --- Unknown or deprecated ACT rules ---
  "3ea0c8", // Unknown ACT rule - not in current testcases
  "e6952f", // Unknown ACT rule - not in current testcases
];

const ignoredExamples = [
  // Can't implement these yet
  "https://act-rules.github.io/testcases/qt1vmo/530266c6116fcfad12561e9e1a407fa0a0da3435.html",
  "https://act-rules.github.io/testcases/qt1vmo/a4b5c0fab27d0ca16b93e8c374c96ad13172e94e.html",
  "https://act-rules.github.io/testcases/qt1vmo/0ef4f516db9ed70cb25f39c99637272808b8e60f.html",

  // [qt1vmo] image-alt: cross-rule interference (document-title fires on fixtures missing <title>)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/af4423575333947073fa3729f502ff0a0c6c2fbf.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/5d314574052bf16676abb0e9a67e48dd70116c2e.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/qt1vmo/2a66c7b8d8ef78d350b1c995e0ad232008f6564f.html",

  // [in6db8] Shadow DOM with script execution + nested template literal breaks TS compilation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/in6db8/ee9eeebf0a0b1a514df6202443345d999d2bd575.html",
];

// Tests that are generated but marked as it.skip — known failures that
// document what the scanner doesn't handle yet.  Unlike ignoredExamples
// (which omit the test entirely), these remain visible as pending work.
const skippedExamples = [
  // [bc659a] meta-refresh: scanner doesn't detect meta refresh delays
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/56857820788db21498e95a5cbba65d59a9a2b892.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/5d4d5b214459c8a0779600ab39a5668003271c62.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/96c7657d21888cd05edd297d44a8fd554b21c908.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc659a/b2e7f3e00ffce0a2a1078f860452814e6445445d.html",

  // [bisz58] letter-spacing-not-important: scanner doesn't detect !important style conflicts
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/b8aad77e3ff2fa8d0272fac5362566ff79afad7f.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/d0672e81d17313f7ef156f3bc6e43c68143a5f45.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bisz58/ecc787569c06640f3748ae90e2b57fb51c1e22d8.html",

  // [c487ae] link-in-text-block: scanner doesn't detect links distinguished only by color
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/3f34996d204260b1b0b50fc8f77b10ab640ba303.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/633d9136ef3e040b7653b287651c65e4302fe417.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/7b3b94c0e39bed9d432f379efa77ba9f54c81c6d.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/7b6b235a0fd8bf9b2023a5d0e446f7ed46e1a40f.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/8816eee206375f88c562d618852cb0383b89fe6e.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/954326e5ba700d4616d924807f427002816e9fc3.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/97b115a032fc4178230306e2d0f4e334b2cfe8a9.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/cc73351605ff3dc9766ad28a1a267a96976ad77b.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/e5b522e069394fa6666bef3746705b70b4628819.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/c487ae/e729027165e293dc32ea88b7264e4c62c306fdd5.html",

  // [eac66b] video-caption: scanner can't detect text transcript as alternative to captions
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/47dd719ce35a9aef8dddd58fc3b1c08956d92889.html",

  // [de46e4] valid-lang: scanner doesn't detect invalid lang subtags on non-root elements
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/49b66676ed867c75368e31c1e06b28255df8089e.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/50e733e0c505a556fc53e6265eb5b432823570f7.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/5ba0306adadd581e4331b9415c2ef9f8ecccc0f2.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/61f81c57325a77a89481f036e4e2116399fb6714.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/78de8b1ca470302aebb53065c32eddf08da008b5.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/795698c08fc5d404b649d0c367bedc3e83462d43.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/915cdae554a817caa4792101fde1adf14563227d.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/b1765660b28464b5a73e502ef30b7370ba294ff5.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/de46e4/d8ba52b5fa5e123def1f778821219aaec20ca0fe.html",
];

for (const rule of applicableRules) {
  const {
    ruleId,
    ruleName,
    testcaseId,
    testcaseTitle,
    expected,
    url: exampleURL,
    ruleAccessibilityRequirements,
  } = rule;

  if (testCasesThatRedirect.includes(testcaseId)) continue;
  if (ruleName.includes("DEPRECATED")) continue;
  if (rulesToIgnore.includes(ruleId)) continue;
  if (ignoredExamples.includes(exampleURL)) continue;
  // Ignore inapplicable results
  if (expected === "inapplicable") continue;

  console.log({ ruleId, testcaseId });

  if (
    Object.keys(ruleAccessibilityRequirements).every(
      (x) => !x.startsWith("wcag"),
    )
  )
    continue;

  const html = await readFile(
    `./tests/act/fixtures/${testcaseId}.html`,
    "utf8",
  );

  // Look up the expected scanner rule URLs for this ACT rule ID so that
  // "failed" assertions can verify the *right* rule triggered the error.
  const expectedUrls = actRuleIdToExpectedUrls[ruleId] || [];

  let assertion = undefined;
  if (expected === "passed") {
    if (expectedUrls.length > 0) {
      const urlsArray = JSON.stringify(expectedUrls);
      assertion = `const expectedUrls = ${urlsArray};\n    const relevant = results.filter(r => expectedUrls.includes(r.url));\n    expect(relevant).to.be.empty;`;
    } else {
      assertion = "expect(results).to.be.empty;";
    }
  } else if (expected === "failed") {
    if (expectedUrls.length > 0) {
      const urlsArray = JSON.stringify(expectedUrls);
      assertion = `expect(results).to.not.be.empty;\n    const expectedUrls = ${urlsArray};\n    expect(results.some(r => expectedUrls.includes(r.url))).to.be.true;`;
    } else {
      assertion = "expect(results).to.not.be.empty;";
    }
  } else {
    throw new Error(`Unknown expected state: ${expected}`);
  }

  const itFn = skippedExamples.includes(exampleURL) ? "it.skip" : "it";

  const suite = `import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[${ruleId}]${ruleName}", function () {
  ${itFn}("${testcaseTitle} (${exampleURL})", async () => {
    const document = parser.parseFromString(\`${html}\`, 'text/html');

    const results = (await scan(document.body)).map(({ text, url }) => {
      return { text, url };
    });

    ${assertion}
  });
});
`;
  await mkdir(`./tests/act/tests/${ruleId}/`, { recursive: true });
  await writeFile(
    `./tests/act/tests/${ruleId}/${testcaseId}.ts`,
    suite,
    "utf8",
  );
}

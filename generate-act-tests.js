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
//
// Rules in the "Custom Rules (Experimental)" section are not part of the
// default rule set, so generated tests must explicitly import and pass them
// to `scan`.  Track those scanner rule IDs per ACT rule ID.
const actRuleIdToExpectedUrls = {};
const actRuleIdToCustomRuleIds = {};
const CUSTOM_SECTION = "Custom Rules (Experimental)";
for (const [sectionName, section] of Object.entries(rulesData)) {
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
      if (sectionName === CUSTOM_SECTION) {
        if (!actRuleIdToCustomRuleIds[actId]) {
          actRuleIdToCustomRuleIds[actId] = [];
        }
        if (!actRuleIdToCustomRuleIds[actId].includes(rule.id)) {
          actRuleIdToCustomRuleIds[actId].push(rule.id);
        }
      }
    }
  }
}

// Convert a scanner rule id (kebab-case) to a JS identifier (camelCase).
function ruleIdToIdent(ruleId) {
  return ruleId.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
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
  // "047fe0", // Document Heading — enabled for bypass rule ACT tests
  "09o5cg", // Text Contrast - requires computed styles for color contrast calculation
  "0va7u6", // Image contains text - requires visual rendering to detect text in images
  "59br37", // Zoomed text node is not clipped with CSS overflow - requires visual rendering
  "afw4f7", // Text has minimum contrast - requires computed styles for color contrast calculation
  "b33eff", // Orientation of the page is not restricted using CSS transforms - requires computed styles
  "oj04fd", // Element in sequential focus order has visible focus - requires visual rendering

  // --- Requires media playback ---
  "1a02b0", // Audio and visuals of video element have transcript - requires media playback
  "1ea59c", // Video element visual content has audio description - requires media playback
  "1ec09b", // Video element visual content has strict accessible alternative - requires media playback
  "4c31df", // Audio or video element that plays automatically has a control mechanism - requires media playback
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
  "59796f", // Image button has non-empty accessible name - not implemented
  "7d6734", // SVG element with explicit role has non-empty accessible name - not implemented
  "cae760", // Iframe element has non-empty accessible name - not implemented

  // --- Not implemented - ARIA rules not yet fully supported ---
  "4e8ab6", // Element with role attribute has required states and properties - not implemented
  "5c01ea", // ARIA state or property is permitted - not implemented
  "674b10", // Role attribute has valid value - not implemented
  "6a7281", // ARIA state or property has valid value - not implemented
  "bc4a75", // ARIA required owned elements - not implemented
  "ff89c9", // ARIA required context role - not implemented
  "307n5z", // Element with presentational children has no focusable content - not implemented
  "kb1m8s", // ARIA global properties not used where prohibited - not implemented

  // --- Not implemented - link and form rules ---
  "5effbb", // Link in context is descriptive - not implemented, requires human judgment
  "aizyf1", // Link is descriptive - not implemented, requires human judgment
  "b20e66", // Links with identical accessible names have equivalent purpose - not implemented
  "fd3a94", // Links with identical accessible names and same context serve equivalent purpose - not implemented
  "cc0f0a", // Form field label is descriptive - not implemented, requires human judgment

  // --- Not implemented - page-level and structural rules ---
  "2779a5", // HTML page has non-empty title - not implemented in ACT test format
  "off6ek", // HTML element language subtag matches language - not implemented
  "ucwvc8", // HTML page language subtag matches default language - not implemented
  "c4a8a4", // HTML page title is descriptive - not implemented, requires human judgment
  // "cf77f2", // Bypass Blocks of Repeated Content — enabled for bypass rule ACT tests
  // "ye5d6e", // Document has an instrument to move focus to non-repeated content — enabled for bypass rule ACT tests
  // "3e12e1", // Block of repeated content is collapsible — enabled for bypass rule ACT tests

  // --- Not implemented - various other rules ---
  "73f2c2", // Autocomplete attribute has valid value - not implemented in ACT test format
  "b4f0c3", // Meta viewport allows for zoom - not implemented in ACT test format
  "4b1c6c", // Iframe elements with identical accessible names have equivalent purpose - not implemented
  "b49b2e", // Heading is descriptive - not implemented, requires human judgment
  "9bd38c", // Content has alternative for visual reference - not implemented, requires human judgment
  "efbfc7", // Text content that changes automatically can be paused, stopped or hidden - not implemented

  // --- Unknown or deprecated ACT rules ---
  "e6952f", // Unknown ACT rule - not in current testcases
];

const ignoredExamples = [
  // Can't implement these yet
  "https://act-rules.github.io/testcases/qt1vmo/530266c6116fcfad12561e9e1a407fa0a0da3435.html",
  "https://act-rules.github.io/testcases/qt1vmo/a4b5c0fab27d0ca16b93e8c374c96ad13172e94e.html",
  "https://act-rules.github.io/testcases/qt1vmo/0ef4f516db9ed70cb25f39c99637272808b8e60f.html",

  // [in6db8] Shadow DOM with script execution + nested template literal breaks TS compilation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/in6db8/ee9eeebf0a0b1a514df6202443345d999d2bd575.html",
];

// Tests that are generated but marked as it.skip — known failures that
// document what the scanner doesn't handle yet.  Unlike ignoredExamples
// (which omit the test entirely), these remain visible as pending work.
const skippedExamples = [
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

  // [6cfa84] aria-hidden-focus: focus sentinel relies on JS to redirect focus, scanner can't evaluate script behavior
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6cfa84/d343bc6a2877b62d80153453c3781debc33e0b1d.html",

  // [eac66b] video-caption: scanner can't detect text transcript as alternative to captions
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/eac66b/47dd719ce35a9aef8dddd58fc3b1c08956d92889.html",

  // [bc4a75] aria-required-children: scanner doesn't validate children of nested group roles
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/bc4a75/5e0e88f9ed776c89735d7db606c1381a7a1fb877.html",

  // [ff89c9] aria-required-parent: scanner doesn't treat aria-live as a context role boundary
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/52508dc0ac389108301d7cbd7f931be45a45741f.html",

  // [ff89c9] aria-required-parent: shadow DOM + aria-owns not supported in DOMParser tests
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ff89c9/f8e3dbe601969ab54954447e04ae384eb52d7082.html",

  // [e88epe] decorative-image: scanner flags role="none" with non-empty alt as a contradiction;
  // ACT considers this passed when the image is actually decorative (requires visual judgment)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/57982b4d5dad90f3f2c06d5e0233694c46842bd0.html",

  // [e88epe] decorative-image: scanner cannot detect non-decorative content from image src alone
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/e5b8fa7ab66409e7b52b335a8b6aebe11fd78635.html",

  // [e88epe] decorative-image: scanner does not analyse SVG visual content
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/0d0061ffdf406f0d9b21aaa00f5d557e4137e0b2.html",

  // [e88epe] decorative-image: scanner does not analyse canvas visual content
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e88epe/6d108d00cc7a54f66547f02d7e7606342b11f801.html",

  // [80f0bf] no-autoplay-audio: scanner can't detect JavaScript-based control mechanisms
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/80f0bf/29ea904ef03f14401a7b43a5ffc9b30271697bc7.html",

  // [2ee8b8] label-content-name-mismatch: scanner cannot detect icon fonts (requires CSS rendering)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2ee8b8/efa9543339cdad5412c7719b266a633a29ce149e.html",

  // [0ssw9k] scrollable-region-focusable: DOMParser has no layout engine so
  // getComputedStyle and scrollHeight/clientHeight cannot detect scrollability
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/0ssw9k/5fa34d0a7eea03109cd12c0e7c21fce793c268db.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/0ssw9k/731acbc281943f3fef81aee32f6a553fc426e20f.html",

  // [047fe0] bypass/heading: scanner can't distinguish repeated vs non-repeated content areas
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/047fe0/4e34cac08353c5383b8743bffada2aaf3a780149.html",
  // [047fe0] bypass/heading: page has no repeated content so rule is inapplicable, but scanner flags it
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/047fe0/4f112d2707661d579bb0e364ef6241ea6217d3e8.html",
  // [047fe0] bypass/heading: heading hidden via CSS (off-screen class), scanner can't detect computed styles
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/047fe0/81d501e52085d9e5712e241bdd24708e7cb4a301.html",

  // [3e12e1] bypass/collapsible: JS-based toggle mechanism requires script execution (DOMParser limitation)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/3e12e1/fa30de1d9c2d3a313f7f18bc4e2cf6843ea10a89.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/3e12e1/01ade7567b9b4be243f4b693e30071596c2f515f.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/3e12e1/be05e4899572cc95d2a56d058ef873f90a979fe2.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/3e12e1/61c51eb3361b472d8bd7cecd205db7bf895f484f.html",

  // [cf77f2] bypass: JS-based skip/toggle mechanism requires script execution (DOMParser limitation)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/fa30de1d9c2d3a313f7f18bc4e2cf6843ea10a89.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/1c8d17ef6a69be1bbc5b28f432d2b7192e0f65c9.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/f937af9c794522e5f421d5cfc3937d34fad2a9e7.html",
  // [cf77f2] bypass: page has no semantic landmarks or headings (only div#main), scanner can't detect
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cf77f2/c039d5c0794751aa5944724b45df214c0e8cc827.html",

  // [ye5d6e] bypass: JS-based skip link (onclick location.assign) requires script execution
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ye5d6e/f75c1d3e3e4d3ef33020e90c115c6f4245170486.html",
  // [ye5d6e] bypass: skip link targets repeated content, scanner can't distinguish content areas
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/ye5d6e/91f4c9b8d66b5a30867b3eb329701acc604d79b9.html",

  // [24afc2] avoid-inline-spacing: requires computed font-size to evaluate px values
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/24afc2/43f8fe88b8e7365db7aa251b263b5d00c7a47ae9.html",
  // [24afc2] avoid-inline-spacing: inherited px spacing with different child font-size requires computed styles
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/24afc2/cabfcae45afac141b38fd9cac2e07a64fb6b9896.html",
  // [24afc2] avoid-inline-spacing: parent !important overridden by child !important requires cascade analysis
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/24afc2/d6d5bf7c081939e64d10022dd29f5e31d2153d50.html",

  // [9e45ec] avoid-inline-spacing: requires computed font-size to evaluate px values
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/2a2a14cc9bcb3fa7983e22f160ce9eeb6b832a8c.html",
  // [9e45ec] avoid-inline-spacing: inherited px spacing with different child font-size requires computed styles
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/15905a239d6755102be6a60aa152ad963d5b1dbb.html",
  // [9e45ec] avoid-inline-spacing: parent !important overridden by child !important requires cascade analysis
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/9e45ec/8d2baed183149375922c23a9a5f42b52b627d713.html",

  // [78fd32] avoid-inline-spacing: requires computed font-size to evaluate px values
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/203a13b314695fc2abc6163b3ac7940ab1c4a9ed.html",
  // [78fd32] avoid-inline-spacing: inherited px spacing with different child font-size requires computed styles
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/78034759a1086c7ffa8037b6e6e2327ece4a19d7.html",
  // [78fd32] avoid-inline-spacing: parent !important overridden by child !important requires cascade analysis
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/78fd32/9280b9961f4e24943080fabb67c041b65036f69c.html",
];

// ACT rules where the scanner rule requires the document element (not body)
// as input, because they perform page-level checks.
const rulesRequiringDocumentElement = [
  "047fe0", // Document has heading
  "3e12e1", // Block of repeated content is collapsible
  "bc659a", // Meta element has no refresh delay (lives in <head>)
  "bisz58", // Meta element has no refresh delay, no exception (lives in <head>)
  "cf77f2", // Bypass blocks of content
  "ye5d6e", // Document has an instrument to move focus to non-repeated content
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

  // Accept WCAG-mapped requirements and ARIA name-calculation requirements
  // (ARIA 1.2 §5.2.8 corresponds to WCAG SC 4.1.2 Name, Role, Value).
  if (
    Object.keys(ruleAccessibilityRequirements).every(
      (x) => !x.startsWith("wcag") && !x.startsWith("aria"),
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
      // No known scanner rules map to this ACT rule — filter is empty so
      // no results are relevant; assert passes trivially.  This avoids
      // false negatives from cross-rule interference.
      assertion = `// No scanner rule maps to this ACT rule yet — nothing to assert.\n    expect([]).to.be.empty;`;
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
  const scanTarget = rulesRequiringDocumentElement.includes(ruleId)
    ? "document.documentElement"
    : "document.body";

  // Custom (experimental) rules aren't part of the default rule set, so they
  // must be imported and passed explicitly to `scan` for these test cases.
  const customRuleIds = actRuleIdToCustomRuleIds[ruleId] || [];
  const customImports = customRuleIds
    .map(
      (rid) =>
        `import ${ruleIdToIdent(rid)} from "../../../../src/rules/${rid}";`,
    )
    .join("\n");
  const scanRulesArg =
    customRuleIds.length > 0
      ? `, [...allRules, ${customRuleIds.map(ruleIdToIdent).join(", ")}]`
      : "";
  const baseImport =
    customRuleIds.length > 0
      ? `import { scan, allRules } from "../../../../src/scanner";`
      : `import { scan } from "../../../../src/scanner";`;

  const suite = `import { expect } from "@open-wc/testing";
${baseImport}${customImports ? "\n" + customImports : ""}

const parser = new DOMParser();

describe("[${ruleId}]${ruleName}", function () {
  ${itFn}("${testcaseTitle} (${exampleURL})", async () => {
    const document = parser.parseFromString(\`${html}\`, 'text/html');

    const results = (await scan(${scanTarget}${scanRulesArg})).map(({ text, url }) => {
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

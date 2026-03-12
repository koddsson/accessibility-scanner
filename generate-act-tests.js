import { mkdir, writeFile, readFile, rm } from "node:fs/promises";

// Clean up previously generated test files to remove stale tests
// when rules are added to the ignore list or test cases are removed.
await rm("./tests/act/tests/", { recursive: true, force: true });

const { testcases } = JSON.parse(await readFile("./testcases.json", "utf8"));

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
  "047fe0", // Document Heading     - https://act-rules.github.io/rules/047fe0
  "09o5cg", // Text Contrast        - https://act-rules.github.io/rules/09o5cg
  "0ssw9k", // Scrollable element   - https://act-rules.github.io/rules/0ssw9k
  "0va7u6", // Image contains text  - https://act-rules.github.io/rules/0va7u6
  "1a02b0",
  "1ea59c",
  "1ec09b",
  "24afc2",
  "2ee8b8",
  "36b590",
  "3e12e1",
  "3ea0c8",
  "4c31df",
  "59br37",
  "5b7ae0",
  "5effbb",
  "6cfa84",
  "7677a9",
  "78fd32",
  "80af7b",
  "80f0bf",
  "8fc3b6",
  "9bd38c",
  "9e45ec",
  "a25f45",
  "aaa1bf",
  "afw4f7",
  "aizyf1",
  "akn7bn",
  "b20e66",
  "b33eff",
  "b49b2e",
  "b5c3f8",
  "bc4a75",
  "c249d5",
  "c3232f",
  "c4a8a4",
  "c5a4ea",
  "cc0f0a",
  "cf77f2",
  "d0f69e",
  "d7ba54",
  "e6952f",
  "e7aa44",
  "e88epe",
  "eac66b",
  "ee13b5",
  "efbfc7",
  "f51b46",
  "fd3a94",
  "ff89c9",
  "ffbc54",
  "ffd0e9",
  "off6ek",
  "oj04fd",
  "ucwvc8",
  "ye5d6e",
  "bf051a",
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

  // [2779a5] document-title: cross-rule interference (frame-tested, frame-title)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/64771c390e57375a822a7223362ea7bb859c0a96.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/94ff40484422832c2910086d4387163aa2d9dd7d.html",
  // [2779a5] scanner doesn't detect this document-title violation yet
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/2779a5/a14968698b0e95b6624f187d4538e320e4fa8952.html",

  // [307n5z] nested-interactive: cross-rule interference or undetected violation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/8c835039e68f3fefc58e8b0985b2060fa02b3480.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/ad7e2441b992318debdeec5a07f92b0241f80a14.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/ccaf2315b5268a447dff07aad635b3ad27aabaf8.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/307n5z/ede992d9573d350db7cd0cb8685de5b96460fbc1.html",

  // [4b1c6c] frame-title-unique: cross-rule interference (document-title, frame-tested, frame-title-unique)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/08c5575023e8bf16caabcf01a1c8d40fe6ecaf94.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/0b43ded650d5794255c23f97f2f1a39d9a19be4b.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/1fe7e9b43510e6e25007a67611a5a0ace14c1fd0.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/21d4d4b931e9f06b5c4a008cb1989aa195c107b6.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/380a799833429075d0e99667d1e0021008aab386.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/40e3400d782be79d036ea5119ff231acb7884f21.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/5741786806bd13c329e3681a0e16f4ed326d7fee.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/72d5c95606c82e7570f3496c4cc02512b639aaf3.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/96600720258c71d467d82fda5d6d0037b7780ec3.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4b1c6c/f8d3c1afa946cf4fc97ef799aad6d9d090de6e8f.html",

  // [4e8ab6] aria-required-attr: cross-rule interference or undetected violation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/11c5321c05c7b83b8707eee76574a94bd44033fe.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/43af91df529613e51429e18d43ce3df99b189c0f.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/4e8ab6/986038d85467255cef4ed7d72c231442427ece23.html",

  // [5c01ea] aria-allowed-attr: cross-rule interference or undetected violation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/655b73c1435335a6a16852210787dc3621e73cef.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/b67ab9861299ffa342880729ee1dbb43d2068a6b.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/d5503ef9eb5b1a3144451f5c3a680548343c9981.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/d7efe21b64461052aef8d3e0fc96049dda787039.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/d934cb530f9bd82f0c84615dfc405efad9b1fc69.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/da2d6c53dd58121d0182d2498a104776da424e21.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/5c01ea/eedabccf6e01bca36ee87a2af00e9d7a63a7d615.html",

  // [674b10] aria-roles: cross-rule interference (aria-input-field-name)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/674b10/c181f7267bf9f4fc0f9ad9e2a69c1ad7da504f4d.html",

  // [6a7281] aria-valid-attr-value: cross-rule interference
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/c27e7f509d546fa6aff12ca7aeace662d3fb1c7b.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/e4b47e094d44a9f3b5b3fd5c157f3ef6679bede0.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/ed053b32aa2b4453ddc225e45f7f1931f62c7f49.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/6a7281/f78fb0548e68839232441636b6d8489ad17c50b5.html",

  // [73f2c2] autocomplete-valid: multi-token autocomplete not fully supported
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/41c94e01a5809d1558eea96efc67a3ac6c90c148.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/73f2c2/ff150593870cd4c1228d5eb69e2e0bc205e09727.html",

  // [7d6734] svg-img-alt: cross-rule interference or undetected violation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/7d6734/c65600eae4b88d275675cb976ceac01b9a4f47e4.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/7d6734/cc172d9a654d94e00505456845920c099fbabfa7.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/7d6734/f2af674524641f89a409d5f91caf512b162d5778.html",

  // [97a4e1] button-name: cross-rule interference (document-title)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/97a4e1/00fe207175e40ddc81a86fb09504e5fa33b7dd0f.html",

  // [b4f0c3] meta-viewport: cross-rule interference (meta-viewport-large) or edge-case values
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/4ade33e41dda291c9078e56ca2a95c4825dbc1fe.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/9f288c284df9ade53aa33e50ec50c879d5aba4ef.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/d143bfe343ecf75bceb92b6fc9807cc5f453b319.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/b4f0c3/e5695989a43a3297cf6b78182014c7a3848ff7e1.html",

  // [cae760] frame-title: cross-rule interference (frame-tested)
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cae760/4075167ff3009336f6b8e87774a297de217a09b5.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cae760/99f10671a6d11813673cd05b0a0c82169c3ec821.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/cae760/fbf477c0e122dc4c283cf7b9a5cb7c2802f6e4c9.html",

  // [e086e5] select-name: cross-rule interference or undetected violation
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/09ea6ee13f7f26b0d6e3103946209ea0726876de.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/5c0ba53d53cc9fd8627f224b39db30bd9ffa5757.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/80a5df2346e082cd0be260143ac9090a902bcf30.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/ca41ec5f1dba602b8b6e332ad524cbfc5cd1505e.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/cfb1790405bb1ff793ed15a73372d53e79d2d7e0.html",
  "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases/e086e5/d9ee6c2ae6da41521bd4ba0bf25c4b6bcd253f37.html",
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

  const rawHtml = await readFile(
    `./tests/act/fixtures/${testcaseId}.html`,
    "utf8",
  );
  // Escape backticks and ${} in HTML to avoid breaking the template literal
  const html = rawHtml.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

  let assertion = undefined;
  if (expected === "passed") {
    assertion = "expect(results).to.be.empty;";
  } else if (expected === "failed") {
    assertion = "expect(results).to.not.be.empty;";
  } else {
    throw new Error(`Unknown expected state: ${expected}`);
  }

  const suite = `import { expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

const parser = new DOMParser();

describe("[${ruleId}]${ruleName}", function () {
  it("${testcaseTitle} (${exampleURL})", async () => {
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

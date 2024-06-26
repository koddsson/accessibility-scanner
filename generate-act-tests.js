import { mkdir, writeFile, readFile } from "node:fs/promises";

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
  "23a2a8",
  "24afc2",
  "2779a5",
  "2ee8b8",
  "307n5z",
  "36b590",
  "3e12e1",
  "3ea0c8",
  "4b1c6c",
  "4c31df",
  "4e8ab6",
  "59796f",
  "59br37",
  "5b7ae0",
  "5c01ea",
  "5effbb",
  "674b10",
  "6a7281",
  "6cfa84",
  "73f2c2",
  "7677a9",
  "78fd32",
  "7d6734",
  "80af7b",
  "80f0bf",
  "8fc3b6",
  "97a4e1",
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
  "b4f0c3",
  "b5c3f8",
  "bc4a75",
  "c249d5",
  "c3232f",
  "c4a8a4",
  "c5a4ea",
  "cae760",
  "cc0f0a",
  "cf77f2",
  "d0f69e",
  "d7ba54",
  "e086e5",
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
  "m6b1q3",
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

  let assertion = undefined;
  if (expected === "passed") {
    assertion = "expect(results).to.be.empty;";
  } else if (expected === "failed") {
    assertion = "expect(results).to.not.be.empty;";
  } else {
    throw new Error(`Unknown expected state: ${expected}`);
  }

  const suite = `import { fixture, expect } from "@open-wc/testing";
import { scan } from "../../../../src/scanner";

describe("[${ruleId}]${ruleName}", function () {
  it("${testcaseTitle} (${exampleURL})", async () => {
    await fixture(\`${html}\`);

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

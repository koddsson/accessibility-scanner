import { fixture, html, expect } from "@open-wc/testing";
import { scan } from "../../src/scanner";

const response = await fetch("/testcases.json");
const json = await response.json();

const applicableRules = json.testcases.filter(
  (rule) => rule.ruleAccessibilityRequirements
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
  "59br37",
  "9e45ec",
  "2ee8b8",
  "1ec09b",
  "1a02b0",
  "ee13b5",
  "d7ba54",
  "c3232f",
  "f51b46",
  "1ea59c",
  "c5a4ea",
  "eac66b",
  "09o5cg",
  "afw4f7",
  "a25f45",
  "d0f69e",
  "oj04fd",
  "0ssw9k",
  "4e8ab6",
  "674b10",
  "ffbc54",
  "307n5z",
  "8fc3b6",
  "9bd38c",
  "b4f0c3",
  "m6b1q3",
  "fd3a94",
  "b20e66",
  "c487ae",
  "5effbb",
];

describe("ACT Rules", function () {
  for (const rule of applicableRules) {
    const { ruleId, ruleName, testcaseId, testcaseTitle, expected } = rule;

    if (testCasesThatRedirect.includes(testcaseId)) continue;
    if (ruleName.includes("DEPRECATED")) continue;
    if (rulesToIgnore.includes(ruleId)) continue;

    it(`[${ruleId}] ${ruleName} - ${testcaseTitle}`, async () => {
      const testResponse = await fetch(
        `/tests/act/fixtures/${testcaseId}.html`
      );
      if (testResponse.status !== 200) {
        throw new Error("Couldn't find testcase HTML");
      }
      const testHTML = await testResponse.text();
      const container = await fixture(testHTML);

      const results = (await scan(container)).map(({ text, url }) => {
        return { text, url };
      });

      if (expected === "passed") {
        expect(results).to.be.empty;
      } else if (expected === "failed") {
        expect(results).to.not.be.empty;
      } else if (expected === "inapplicable") {
        expect(results).to.be.empty;
      } else {
        throw new Error(`Unknown expected state: ${expected}`);
      }
    });
  }
});

import { fixture, html, expect } from "@open-wc/testing";
import { Scanner } from "../src/scanner";
import {
  ariaValidAttrValue,
  text,
  url,
} from "../src/rules/aria-valid-attr-value";

const scanner = new Scanner([ariaValidAttrValue]);

const passes = [
  await fixture(html`<div aria-activedescendant="ref" id="pass1">hi</div>`),
  await fixture(html`<div aria-atomic="true" id="pass2">hi</div>`),
  await fixture(html`<div aria-atomic="false" id="pass3">hi</div>`),
  await fixture(html`<div aria-autocomplete="inline" id="pass4">inline</div>`),
  await fixture(html`<div aria-autocomplete="list" id="pass5">list</div>`),
  await fixture(html`<div aria-autocomplete="both" id="pass6">both</div>`),
  await fixture(html`<div aria-autocomplete="none" id="pass7">none</div>`),
  await fixture(html`<div aria-busy="true" id="pass8">hi</div>`),
  await fixture(html`<div aria-busy="false" id="pass9">hi</div>`),
  await fixture(html`<div aria-checked="true" id="pass10">hi</div>`),
  await fixture(html`<div aria-checked="false" id="pass11">hi</div>`),
  await fixture(html`<div aria-checked="mixed" id="pass12">hi</div>`),
  await fixture(html`<div aria-checked="undefined" id="pass13">hi</div>`),
  await fixture(html`<div aria-current="page" id="pass14">hi</div>`),
  await fixture(html`<div aria-current="step" id="pass15">hi</div>`),
  await fixture(html`<div aria-current="true" id="pass16">hi</div>`),
  await fixture(html`<div aria-current="location" id="pass17">hi</div>`),
  await fixture(html`<div aria-current="date" id="pass18">hi</div>`),
  await fixture(html`<div aria-current="time" id="pass19">hi</div>`),
  await fixture(html`<div aria-controls="ref" id="pass20">hi</div>`),
  await fixture(html`<div aria-controls="ref ref2" id="pass21">hi</div>`),
  await fixture(html`<div aria-controls=" ref ref2 " id="pass22">hi</div>`),
  await fixture(html`<div aria-describedby="ref" id="pass23">hi</div>`),
  await fixture(
    html`<div aria-describedby="ref ref2 failref" id="pass24">hi</div>`
  ),
  await fixture(html`<div aria-describedby=" ref ref2 " id="pass25">hi</div>`),
  await fixture(html`<div aria-disabled="true" id="pass26">hi</div>`),
  await fixture(html`<div aria-disabled="false" id="pass27">hi</div>`),
  await fixture(html`<div aria-dropeffect="copy" id="pass28">hi</div>`),
  await fixture(html`<div aria-dropeffect="move" id="pass29">hi</div>`),
  await fixture(html`<div aria-dropeffect="link" id="pass30">hi</div>`),
  await fixture(html`<div aria-dropeffect="execute" id="pass31">hi</div>`),
  await fixture(html`<div aria-dropeffect="popup" id="pass32">hi</div>`),
  await fixture(html`<div aria-dropeffect="none" id="pass33">hi</div>`),
  await fixture(html`<div aria-expanded="true" id="pass34">hi</div>`),
  await fixture(html`<div aria-expanded="false" id="pass35">hi</div>`),
  await fixture(html`<div aria-expanded="undefined" id="pass36">hi</div>`),
  await fixture(html`<div aria-flowto="ref" id="pass37">hi</div>`),
  await fixture(html`<div aria-flowto="ref ref2" id="pass38">hi</div>`),
  await fixture(html`<div aria-flowto=" ref ref2 " id="pass39">hi</div>`),
  await fixture(html`<div aria-grabbed="true" id="pass40">hi</div>`),
  await fixture(html`<div aria-grabbed="false" id="pass41">hi</div>`),
  await fixture(html`<div aria-grabbed="undefined" id="pass42">hi</div>`),
  await fixture(html`<div aria-haspopup="true" id="pass43">hi</div>`),
  await fixture(html`<div aria-haspopup="false" id="pass44">hi</div>`),
  await fixture(html`<div aria-haspopup="menu" id="pass45">hi</div>`),
  await fixture(html`<div aria-haspopup="listbox" id="pass46">hi</div>`),
  await fixture(html`<div aria-haspopup="tree" id="pass47">hi</div>`),
  await fixture(html`<div aria-haspopup="grid" id="pass48">hi</div>`),
  await fixture(html`<div aria-haspopup="dialog" id="pass49">hi</div>`),
  await fixture(html`<div aria-hidden="false" id="pass50">hi</div>`),
  await fixture(html`<div aria-invalid="true" id="pass51">hi</div>`),
  await fixture(html`<div aria-invalid="false" id="pass52">hi</div>`),
  await fixture(html`<div aria-invalid="spelling" id="pass53">hi</div>`),
  await fixture(html`<div aria-invalid="grammar" id="pass54">hi</div>`),
  await fixture(html`<div aria-label="stuff" id="pass55">hi</div>`),
  await fixture(html`<div aria-labelledby="ref" id="pass56">hi</div>`),
  await fixture(
    html`<div aria-labelledby="ref ref2 failedref" id="pass57">hi</div>`
  ),
  await fixture(html`<div aria-labelledby=" ref ref2 " id="pass58">hi</div>`),
  await fixture(html`<div aria-level="1" id="pass59">hi</div>`),
  await fixture(html`<div aria-level="+1" id="pass61">hi</div>`),
  await fixture(html`<div aria-live="off" id="pass66">hi</div>`),
  await fixture(html`<div aria-live="polite" id="pass67">hi</div>`),
  await fixture(html`<div aria-live="assertive" id="pass68">hi</div>`),
  await fixture(html`<div aria-modal="true" id="pass69">hi</div>`),
  await fixture(html`<div aria-modal="false" id="pass70">hi</div>`),
  await fixture(html`<div aria-multiline="true" id="pass71">hi</div>`),
  await fixture(html`<div aria-multiline="false" id="pass72">hi</div>`),
  await fixture(html`<div aria-multiselectable="true" id="pass73">hi</div>`),
  await fixture(html`<div aria-multiselectable="false" id="pass74">hi</div>`),
  await fixture(html`<div aria-orientation="horizontal" id="pass75">hi</div>`),
  await fixture(html`<div aria-orientation="vertical" id="pass76">hi</div>`),
  await fixture(html`<div aria-owns="ref" id="pass77">hi</div>`),
  await fixture(html`<div aria-owns="ref ref2 failedref" id="pass78">hi</div>`),
  await fixture(html`<div aria-owns=" ref ref2 " id="pass79">hi</div>`),
  await fixture(html`<div aria-posinset="1" id="pass80">hi</div>`),
  await fixture(html`<div aria-posinset="22" id="pass81">hi</div>`),
  await fixture(html`<div aria-posinset="+1" id="pass82">hi</div>`),
  await fixture(html`<div aria-posinset="+22" id="pass83">hi</div>`),
  await fixture(html`<div aria-pressed="true" id="pass87">hi</div>`),
  await fixture(html`<div aria-pressed="false" id="pass88">hi</div>`),
  await fixture(html`<div aria-pressed="mixed" id="pass89">hi</div>`),
  await fixture(html`<div aria-pressed="undefined" id="pass90">hi</div>`),
  await fixture(html`<div aria-readonly="true" id="pass91">hi</div>`),
  await fixture(html`<div aria-readonly="false" id="pass92">hi</div>`),
  await fixture(html`<div aria-relevant="additions" id="pass93">hi</div>`),
  await fixture(html`<div aria-relevant="removals" id="pass94">hi</div>`),
  await fixture(html`<div aria-relevant="text" id="pass95">hi</div>`),
  await fixture(html`<div aria-relevant="all" id="pass96">hi</div>`),
  await fixture(html`<div aria-required="true" id="pass97">hi</div>`),
  await fixture(html`<div aria-required="false" id="pass98">hi</div>`),
  await fixture(html`<div aria-selected="true" id="pass99">hi</div>`),
  await fixture(html`<div aria-selected="false" id="pass100">hi</div>`),
  await fixture(html`<div aria-selected="undefined" id="pass101">hi</div>`),
  await fixture(html`<div aria-setsize="0" id="pass102">hi</div>`),
  await fixture(html`<div aria-setsize="1" id="pass103">hi</div>`),
  await fixture(html`<div aria-setsize="22" id="pass104">hi</div>`),
  await fixture(html`<div aria-setsize="-1" id="pass105">hi</div>`),
  await fixture(html`<div aria-setsize="+1" id="pass106">hi</div>`),
  await fixture(html`<div aria-setsize="+22" id="pass107">hi</div>`),
  await fixture(html`<div aria-sort="ascending" id="pass109">hi</div>`),
  await fixture(html`<div aria-sort="descending" id="pass110">hi</div>`),
  await fixture(html`<div aria-sort="other" id="pass111">hi</div>`),
  await fixture(html`<div aria-sort="none" id="pass112">hi</div>`),
  await fixture(html`<div aria-valuemax="0.1" id="pass113">hi</div>`),
  await fixture(html`<div aria-valuemax="1.1" id="pass114">hi</div>`),
  await fixture(html`<div aria-valuemax="12.22" id="pass115">hi</div>`),
  await fixture(html`<div aria-valuemax="1." id="pass116">hi</div>`),
  await fixture(html`<div aria-valuemax=".1" id="pass117">hi</div>`),
  await fixture(html`<div aria-valuemax="412" id="pass118">hi</div>`),
  await fixture(html`<div aria-valuemax="+0.1" id="pass119">hi</div>`),
  await fixture(html`<div aria-valuemax="+1.1" id="pass120">hi</div>`),
  await fixture(html`<div aria-valuemax="+12.22" id="pass121">hi</div>`),
  await fixture(html`<div aria-valuemax="+1." id="pass122">hi</div>`),
  await fixture(html`<div aria-valuemax="+.1" id="pass123">hi</div>`),
  await fixture(html`<div aria-valuemax="+412" id="pass124">hi</div>`),
  await fixture(html`<div aria-valuemax="-0.1" id="pass125">hi</div>`),
  await fixture(html`<div aria-valuemax="-1.1" id="pass126">hi</div>`),
  await fixture(html`<div aria-valuemax="-12.22" id="pass127">hi</div>`),
  await fixture(html`<div aria-valuemax="-1." id="pass128">hi</div>`),
  await fixture(html`<div aria-valuemax="-.1" id="pass129">hi</div>`),
  await fixture(html`<div aria-valuemax="-412" id="pass130">hi</div>`),
  await fixture(html`<div aria-valuemin="0.1" id="pass131">hi</div>`),
  await fixture(html`<div aria-valuemin="1.1" id="pass132">hi</div>`),
  await fixture(html`<div aria-valuemin="12.22" id="pass133">hi</div>`),
  await fixture(html`<div aria-valuemin="1." id="pass134">hi</div>`),
  await fixture(html`<div aria-valuemin=".1" id="pass135">hi</div>`),
  await fixture(html`<div aria-valuemin="412" id="pass136">hi</div>`),
  await fixture(html`<div aria-valuemin="+0.1" id="pass137">hi</div>`),
  await fixture(html`<div aria-valuemin="+1.1" id="pass138">hi</div>`),
  await fixture(html`<div aria-valuemin="+12.22" id="pass139">hi</div>`),
  await fixture(html`<div aria-valuemin="+1." id="pass140">hi</div>`),
  await fixture(html`<div aria-valuemin="+.1" id="pass141">hi</div>`),
  await fixture(html`<div aria-valuemin="+412" id="pass142">hi</div>`),
  await fixture(html`<div aria-valuemin="-0.1" id="pass143">hi</div>`),
  await fixture(html`<div aria-valuemin="-1.1" id="pass144">hi</div>`),
  await fixture(html`<div aria-valuemin="-12.22" id="pass145">hi</div>`),
  await fixture(html`<div aria-valuemin="-1." id="pass146">hi</div>`),
  await fixture(html`<div aria-valuemin="-.1" id="pass147">hi</div>`),
  await fixture(html`<div aria-valuemin="-412" id="pass148">hi</div>`),
  await fixture(html`<div aria-valuenow="0.1" id="pass149">hi</div>`),
  await fixture(html`<div aria-valuenow="1.1" id="pass150">hi</div>`),
  await fixture(html`<div aria-valuenow="12.22" id="pass151">hi</div>`),
  await fixture(html`<div aria-valuenow="1." id="pass152">hi</div>`),
  await fixture(html`<div aria-valuenow=".1" id="pass153">hi</div>`),
  await fixture(html`<div aria-valuenow="412" id="pass154">hi</div>`),
  await fixture(html`<div aria-valuenow="+0.1" id="pass155">hi</div>`),
  await fixture(html`<div aria-valuenow="+1.1" id="pass156">hi</div>`),
  await fixture(html`<div aria-valuenow="+12.22" id="pass157">hi</div>`),
  await fixture(html`<div aria-valuenow="+1." id="pass158">hi</div>`),
  await fixture(html`<div aria-valuenow="+.1" id="pass159">hi</div>`),
  await fixture(html`<div aria-valuenow="+412" id="pass160">hi</div>`),
  await fixture(html`<div aria-valuenow="-0.1" id="pass161">hi</div>`),
  await fixture(html`<div aria-valuenow="-1.1" id="pass162">hi</div>`),
  await fixture(html`<div aria-valuenow="-12.22" id="pass163">hi</div>`),
  await fixture(html`<div aria-valuenow="-1." id="pass164">hi</div>`),
  await fixture(html`<div aria-valuenow="-.1" id="pass165">hi</div>`),
  await fixture(html`<div aria-valuenow="-412" id="pass166">hi</div>`),
  await fixture(html`<div aria-valuetext="stuff" id="pass167">hi</div>`),
  // await fixture(html`
  //   <div>
  //     <div id="pass168-ref" role="alert"></div>
  //     <div aria-errormessage="pass168-ref" id="pass168" aria-invalid="true">
  //       hi
  //     </div>
  //   </div>`
  // ),
  // await fixture(html`<div>
  //     <div aria-live="assertive" id="pass68">hi</div>
  //     <div aria-errormessage="pass68" id="pass169" aria-invalid="true">
  //       hi
  //     </div>
  //   </div>`
  // ),
  await fixture(
    html`<div
      aria-errormessage="ref"
      aria-describedby="ref"
      aria-invalid="true"
      id="pass170"
    >
      hi
    </div>`
  ),
  await fixture(html`<div aria-activedescendant="" id="pass171">hi</div>`),
  await fixture(html`<div aria-current="" id="pass172">hi</div>`),
  await fixture(html`<div aria-controls="" id="pass174">hi</div>`),
  await fixture(html`<div aria-describedby="" id="pass175">hi</div>`),
  await fixture(
    html`<div aria-errormessage="" id="pass176" aria-invalid="true">hi</div>`
  ),
  await fixture(html`<div aria-flowto="" id="pass177">hi</div>`),
  await fixture(html`<div aria-haspopup="" id="pass178">hi</div>`),
  await fixture(html`<div aria-keyshortcuts="" id="pass180">hi</div>`),
  await fixture(html`<div aria-label="" id="pass181">hi</div>`),
  await fixture(html`<div aria-labelledby="" id="pass182">hi</div>`),
  await fixture(html`<div aria-owns="" id="pass183">hi</div>`),
  await fixture(html`<div aria-placeholder="" id="pass184">hi</div>`),
  await fixture(html`<div aria-errormessage="invalidId" id="pass185">hi</div>`),
  await fixture(
    html`<div aria-errormessage="invalidId" aria-invalid="false" id="pass186">
      hi
    </div>`
  ),
  // await fixture(
  //   html`<div>
  //     <div aria-live="assertive" id="pass68">hi</div>
  //     <input
  //       type="text"
  //       id="pass187"
  //       aria-invalid="true"
  //       aria-errormessage="pass68"
  //     />
  //   </div>`
  // ),
  await fixture(
    html`<div aria-live="assertive" aria-hidden="false" id="pass188">hi</div>`
  ),
  // await fixture(
  //   html`<div>
  //     <div aria-live="assertive" aria-hidden="false" id="pass188">hi</div>
  //     <input
  //       type="text"
  //       id="pass189"
  //       aria-invalid="true"
  //       aria-errormessage="pass188"
  //     />
  //   </div>`
  // ),
  await fixture(
    html`<div>
      <input
        type="text"
        id="pass190"
        aria-invalid="false"
        aria-errormessage="violation44-ref"
      />
      <div id="violation44-ref" hidden>Error message 1</div>
    </div>`
  )
];

const violations = [
  await fixture(
    html`<div aria-activedescendant="Idonotexist" id="violation1">hi</div>`
  ),
  await fixture(
    html`<div aria-activedescendant="ref noexist ref2" id="violation2">hi</div>`
  ),
  await fixture(html`<div aria-atomic="blah" id="violation3">hi</div>`),
  await fixture(
    html`<div aria-autocomplete="stuff" id="violation4">none</div>`
  ),
  await fixture(html`<div aria-busy="blah" id="violation5">hi</div>`),
  await fixture(html`<div aria-checked="stuff" id="violation6">hi</div>`),
  await fixture(html`<div aria-controls="stuff" id="violation7">hi</div>`),
  await fixture(html`<div aria-disabled="stuff" id="violation10">hi</div>`),
  await fixture(html`<div aria-dropeffect="stuff" id="violation11">hi</div>`),
  await fixture(html`<div aria-expanded="stuff" id="violation12">hi</div>`),
  await fixture(html`<div aria-flowto="stuff" id="violation13">hi</div>`),
  await fixture(html`<div aria-grabbed="stuff" id="violation14">hi</div>`),
  await fixture(html`<div aria-haspopup="stuff" id="violation15">hi</div>`),
  await fixture(html`<div aria-hidden="stuff" id="violation16">hi</div>`),
  await fixture(html`<div aria-invalid="stuff" id="violation17">hi</div>`),
  await fixture(html`<div aria-level="stuff" id="violation19">hi</div>`),
  await fixture(html`<div aria-live="stuff" id="violation20">hi</div>`),
  await fixture(html`<div aria-multiline="stuff" id="violation21">hi</div>`),
  await fixture(
    html`<div aria-multiselectable="stuff" id="violation22">hi</div>`
  ),
  await fixture(html`<div aria-owns="stuff" id="violation23">hi</div>`),
  await fixture(html`<div aria-posinset="stuff" id="violation24">hi</div>`),
  await fixture(html`<div aria-pressed="stuff" id="violation25">hi</div>`),
  await fixture(html`<div aria-readonly="stuff" id="violation26">hi</div>`),
  await fixture(html`<div aria-relevant="stuff" id="violation27">hi</div>`),
  await fixture(html`<div aria-required="stuff" id="violation28">hi</div>`),
  await fixture(html`<div aria-selected="stuff" id="violation29">hi</div>`),
  await fixture(html`<div aria-setsize="stuff" id="violation30">hi</div>`),
  await fixture(html`<div aria-sort="stuff" id="violation31">hi</div>`),
  await fixture(html`<div aria-valuemax="stuff" id="violation32">hi</div>`),
  await fixture(html`<div aria-valuemin="stuff" id="violation33">hi</div>`),
  await fixture(html`<div aria-valuenow="stuff" id="violation34">hi</div>`),
  await fixture(
    html`
    <div>
      <div id="violation35-ref"></div>
      <div
        aria-errormessage="violation35-ref"
        aria-invalid="true"
        id="violation35"
      >
        hi
      </div>
    </div>`
  ),
  await fixture(html`<div aria-valuetext="" id="violation36"></div>`),
  await fixture(html`<div aria-level="0" id="violation37">hi</div>`),
  await fixture(html`<div aria-level="-1" id="violation38">hi</div>`),
  await fixture(html`<div aria-level="-22" id="violation39">hi</div>`),
  await fixture(html`<div aria-posinset="0" id="violation40">hi</div>`),
  await fixture(html`<div aria-posinset="-1" id="violation41">hi</div>`),
  await fixture(html`<div aria-posinset="-22" id="violation42">hi</div>`),
  await fixture(html`<div aria-setsize="-22" id="violation43">hi</div>`),
  await fixture(
    html`<div>
      <input
        type="text"
        id="violation44"
        aria-invalid="true"
        aria-errormessage="violation44-ref"
      />
      <div id="violation44-ref" hidden>Error message 1</div>
    </div>`
  ),
  await fixture(
    html`<div>
      <input
        type="text"
        id="violation45"
        aria-invalid="true"
        aria-errormessage="violation45-ref"
      />
      <div id="violation45-ref" style="display: none">Error message 1</div>
    </div>`
  ),
  await fixture(
    html`<div>
      <input
        type="text"
        id="violation46"
        aria-invalid="true"
        aria-errormessage="violation46-ref"
      />
      <div id="violation46-ref" style="visibility: hidden">Error message 1</div>
    </div>`
  ),
  await fixture(
    html`<div>
      <input
        type="text"
        id="violation47"
        aria-invalid="true"
        aria-errormessage="violation47-ref"
      />
      <div id="violation47-ref" aria-hidden="true">Error message 1</div>
    </div>`
  ),
];

describe.only("aria-valid-attr", async function () {
  beforeEach(async () => {
    await fixture(html`<div id="ref">Hi</div>`)
    await fixture(html`<div id="ref2">Hi2</div>`)
  })

  for (const el of passes) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.be.empty;
    });
  }

  for (const el of violations) {
    it(el.outerHTML, async () => {
      const results = (await scanner.scan(el)).map(({ text, url }) => {
        return { text, url };
      });

      expect(results).to.eql([
        {
          text,
          url,
        },
      ]);
    });
  }
});

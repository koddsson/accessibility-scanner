import { readFile, writeFile, access } from "node:fs/promises";
import Bottleneck from "bottleneck";

// throttle: start very conservative; you can loosen later
const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 900 }); // ~≤1 req/s

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetries(
  url,
  opts = {},
  { tries = 6, baseDelay = 600 } = {},
) {
  let attempt = 0;
  while (true) {
    attempt++;
    const res = await fetch(url, {
      headers: {
        // keep a stable, honest identity; don’t spoof Chrome—just be consistent
        "User-Agent": "WorkbrewFetcher/1.0 (+contact: kristjan@workbrew.com)",
        "Accept-Language": "en",
        "Accept-Encoding": "gzip, br",
        Connection: "keep-alive",
        ...(opts.headers || {}),
      },
      ...opts,
    });

    // happy path
    if (res.ok) return res;

    // Cloudflare / rate-limit handling
    if (res.status === 429 || res.headers.get("cf-mitigated") === "challenge") {
      // If they give us a hint, use it
      const ra = res.headers.get("retry-after");
      const delayFromHeader = ra ? Math.max(0, parseFloat(ra) * 1000) : null;
      if (attempt >= tries)
        throw new Error(`429/challenge after ${attempt} attempts: ${url}`);
      const backoff = Math.min(30_000, baseDelay * 2 ** (attempt - 1));
      const jitter = Math.random() * backoff;
      await sleep(delayFromHeader ?? jitter);
      // extra small jitter to de-sync
      await sleep(100 + Math.random() * 400);
      continue;
    }

    // Optional retry on transient 5xx
    if (res.status >= 500 && res.status < 600 && attempt < tries) {
      const backoff = Math.min(30_000, baseDelay * 2 ** (attempt - 1));
      const jitter = Math.random() * backoff;
      await sleep(jitter);
      continue;
    }

    return res; // will be handled by caller
  }
}

const json = await readFile("./testcases.json", "utf8");
const { testcases } = JSON.parse(json);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      return false;
    } else {
      throw error;
    }
  }
}

for (const testcase of testcases) {
  const id = testcase.testcaseId;
  console.log(id);
  const path = `./tests/act/fixtures/${id}.html`;
  if (await exists(path)) {
    console.log("Already exists");
    continue;
  }
  // run each fetch through the limiter (throttle) + retry logic
  const response = await limiter.schedule(() => fetchWithRetries(testcase.url));
  const html = await response.text();
  if (response.status === 200) {
    console.log("OK");
    await writeFile(`./tests/act/fixtures/${id}.html`, html);
  } else {
    console.log(testcase.url);
    console.log("================");
    console.log(response.headers);
    console.log("================");
    console.log(html);
    break;
  }
  // polite jitter between items even when OK
  await sleep(300 + Math.random() * 900);
}

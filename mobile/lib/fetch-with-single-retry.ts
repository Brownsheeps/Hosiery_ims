const RETRY_DELAY_MS = 750;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithSingleRetry<T>(url: string, options: RequestInit) {
  async function attempt() {
    const response = await fetch(url, options);
    const json: T = await response.json();
    return { response, json };
  }

  try {
    const result = await attempt();
    if (result.response.ok) {
      return result;
    }
  } catch {
    // Retry once below.
  }

  await wait(RETRY_DELAY_MS);
  return attempt();
}

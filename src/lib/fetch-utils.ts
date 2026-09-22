/**
 * Robust HTTP fetching utility with exponential backoff retry and timeout protection.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3,
  timeoutMs = 15000
): Promise<Response> {
  const headers = {
    Accept: "application/json, text/xml, application/xml, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 OffCampusJobAggregator/3.0",
    ...(options.headers || {}),
  };

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timer);

      // If rate-limited (429) or server error (5xx), back off and retry
      if (response.status === 429 || (response.status >= 500 && response.status <= 504)) {
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 300, 5000);
          console.warn(`[fetchWithRetry] HTTP ${response.status} for ${url}. Retrying in ${Math.round(delay)}ms (attempt ${attempt}/${maxRetries})...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      return response;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1) + Math.random() * 300, 5000);
        console.warn(`[fetchWithRetry] Fetch failed for ${url}: ${err.message}. Retrying in ${Math.round(delay)}ms (attempt ${attempt}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error(`Failed to fetch ${url} after ${maxRetries} attempts`);
}

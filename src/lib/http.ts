const DEFAULT_TIMEOUT = 3000;

export async function fetchJson<T>(input: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? DEFAULT_TIMEOUT);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function safeFetch<T>(fn: () => Promise<T | undefined>): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.error("External fetch failed", error);
    return undefined;
  }
}

/**
 * Server-only helpers for calling the backend API with auth, caching, and retries.
 */
import "server-only";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

/** Options for backend calls with sensible defaults. */
type BeInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  tags?: string[];
  revalidate?: number;      // seconds
  timeoutMs?: number;       // default 8_000
  retries?: number;         // default 1
};

/**
 * Low-level backend fetch that attaches session bearer, supports retries,
 * timeouts, and Next.js caching for GETs via `tags`/`revalidate`.
 */
export async function be(path: string, init: BeInit = {}): Promise<Response> {
  const session = await auth();
  const token = (session as any)?.accessToken;               // your JWE
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const url = `${base}${path}`;

  const { tags, revalidate, timeoutMs = 8000, retries = 1, headers, ...rest } = init;

  const isWrite = (rest.method ?? "GET") !== "GET";
  const nextOpts = !isWrite && (tags?.length || revalidate)
    ? { tags, revalidate }
    : undefined;

  const attempt = async () =>
    fetch(url, {
      ...rest,
      signal: AbortSignal.timeout ? AbortSignal.timeout(timeoutMs) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      // cache controls
      cache: isWrite ? "no-store" : "force-cache",
      next: nextOpts,
    });

  let res = await attempt();
  let tries = retries;
  while (tries > 0 && (res.status >= 500 || res.status === 429)) {
    await new Promise(r => setTimeout(r, 400 * (retries - tries + 1)));
    res = await attempt();
    tries--;
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`BE ${res.status}: ${txt || res.statusText}`);
  }
  return res;
}

/**
 * JSON convenience wrapper around `be()` that parses the JSON body.
 */
export async function beJSON<T>(path: string, init?: BeInit): Promise<T> {
  const res = await be(path, init);
  return res.json() as Promise<T>;
}

/**
 * Convenience for POST-like writes plus optional cache busting of tags.
 */
export async function beWrite(path: string, body: unknown, opts: Omit<BeInit, "method"|"body"> & { tagsToRevalidate?: string[] } = {}) {
  await be(path, { ...opts, method: "POST", body: JSON.stringify(body) });
  opts.tagsToRevalidate?.forEach(t => revalidateTag(t));
}

/**
 * Client-side helper to fetch metadata via our server route to avoid CORS.
 */
export type PrefillMeta = { title?: string; description?: string };

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function prefillFromUrl(inputUrl: string): Promise<PrefillMeta> {
  if (!isHttpUrl(inputUrl)) return {};
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${base.replace(/\/$/, "")}/prefill?url=${encodeURIComponent(inputUrl)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as PrefillMeta;
  } catch {
    return {};
  }
}

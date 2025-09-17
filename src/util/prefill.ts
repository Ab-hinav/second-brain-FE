/**
 * Client-side helpers to fetch metadata for known URLs and prefill forms.
 * Supports Twitter/X and YouTube via oEmbed, with a generic fallback using noembed.
 */

export type PrefillMeta = {
  title?: string;
  description?: string;
};

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isTwitter(u: URL) {
  return /(^|\.)twitter\.com$/i.test(u.hostname) || /(^|\.)x\.com$/i.test(u.hostname);
}

function isYouTube(u: URL) {
  return /(^|\.)youtube\.com$/i.test(u.hostname) || /(^|\.)youtu\.be$/i.test(u.hostname);
}

function stripHtmlToText(html: string): string {
  if (typeof document === "undefined") return html;
  const el = document.createElement("div");
  el.innerHTML = html;
  const txt = el.textContent || el.innerText || "";
  return txt.replace(/\s+/g, " ").trim();
}

async function fetchTwitterOEmbed(url: string): Promise<PrefillMeta | null> {
  try {
    const res = await fetch(
      `https://publish.twitter.com/oembed?omit_script=1&hide_thread=1&dnt=1&url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const text = typeof data.html === "string" ? stripHtmlToText(data.html) : undefined;
    const author = typeof data.author_name === "string" ? data.author_name : undefined;
    return {
      title: text ? (text.length > 100 ? text.slice(0, 100) + "…" : text) : author ? `Tweet by ${author}` : undefined,
      description: text,
    };
  } catch {
    return null;
  }
}

async function fetchYouTubeOEmbed(url: string): Promise<PrefillMeta | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const title: string | undefined = data?.title;
    const author: string | undefined = data?.author_name;
    return {
      title: title,
      description: author ? `by ${author}` : undefined,
    };
  } catch {
    return null;
  }
}

async function fetchNoEmbed(url: string): Promise<PrefillMeta | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const html: string | undefined = data?.html;
    const title: string | undefined = data?.title;
    const author: string | undefined = data?.author_name;
    const text = html ? stripHtmlToText(html) : undefined;
    return {
      title: title || (text ? (text.length > 100 ? text.slice(0, 100) + "…" : text) : undefined),
      description: text || author,
    };
  } catch {
    return null;
  }
}

/**
 * Attempts to fetch metadata for the given URL.
 * - Twitter/X → publish.twitter.com oEmbed
 * - YouTube → youtube oEmbed
 * - Else → noembed fallback
 */
export async function prefillFromUrl(inputUrl: string): Promise<PrefillMeta> {
  if (!isHttpUrl(inputUrl)) return {};
  const u = new URL(inputUrl);

  // 1) Twitter/X
  if (isTwitter(u)) {
    const tw = await fetchTwitterOEmbed(inputUrl);
    if (tw) return tw;
  }

  // 2) YouTube
  if (isYouTube(u)) {
    const yt = await fetchYouTubeOEmbed(inputUrl);
    if (yt) return yt;
  }

  // 3) Generic fallback
  const ne = await fetchNoEmbed(inputUrl);
  if (ne) return ne;

  return {};
}


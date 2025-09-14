/**
 * Server-only API helper to fetch details for a single brain (metadata, etc.).
 * Revalidates every ~10s and tags responses with `${brainId}:detail`.
 */
import { BrainDetails } from "@/types/brain";
import { beJSON } from "@/util/be";


export async function getBrainDetails(brainId: string): Promise<BrainDetails> {
  return beJSON<BrainDetails>(
    `/brain-detail/${brainId}`,
    { tags: [`${brainId}:detail`], revalidate: 1 }
  );
}

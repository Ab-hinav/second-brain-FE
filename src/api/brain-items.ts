import { beJSON } from "@/util/be";
import { BrainItem } from "@/types/brain";

/**
 * Fetch items for a specific brain, optionally filtered by type or search query.
 */
export async function getBrainItems(
  brainId: string,
  type?: string,
  search?: string
): Promise<BrainItem[]> {
  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (search) params.set("search", search);

  const queryString = params.toString() ? `?${params.toString()}` : "";

  // The README suggests using the tag `${brainId}:all` for lists of items.
  return beJSON<BrainItem[]>(
    `/brain/${brainId}/items${queryString}`,
    {
      tags: [`${brainId}:all`],
      revalidate: 10,
    }
  );
}

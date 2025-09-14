import { beJSON } from "@/util/be";

export type Tags = {
name:string,
color:string
}[]


/**
 * Fetch the list of user-visible tags used in the sidebar tag cloud.
 */
export async function getAllTags(): Promise<Tags> {
  return beJSON<Tags>("/tags", { tags: ["all-tag"], revalidate: 6 });
}

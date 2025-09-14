/**
 * Server-only API helper to fetch the user's brains for dashboard navigation.
 * Attaches the session bearer token when present and enables Next.js tag-based
 * caching with revalidate every ~10s via tag "brain-nav".
 */

import "server-only";

import { BrainNav } from "@/types/brain";
import { beJSON } from "@/util/be";





/**
 * Fetch the list of brains available to the current user.
 * Returns a BrainNav array used by the sidebar.
 */
export async function getBrainNav(): Promise<BrainNav> {
  return beJSON<BrainNav>(
    "/brain-nav",
    { tags: ["brain-nav"], revalidate: 6 }
  );
}

"use server";

import { beWrite } from "@/util/be";

/**
 * Toggles the public access status of a brain.
 */
export async function shareBrain(brainId: string, isPublic: boolean) {
  try {
    // Assuming PUT or POST for updating share settings
    await beWrite(
      `/brain/${brainId}/share`,
      { public: isPublic },
      { tagsToRevalidate: [`${brainId}:detail`] }
    );
  } catch (error) {
    console.error("Failed to update share settings:", error);
    throw new Error("Failed to update share settings");
  }
}

/**
 * Invites a user to collaborate on a brain by email.
 */
export async function inviteCollaborator(brainId: string, email: string) {
  try {
    await beWrite(
      `/brain/${brainId}/invite`,
      { email },
      { tagsToRevalidate: [`${brainId}:detail`] }
    );
  } catch (error) {
    console.error("Failed to invite collaborator:", error);
    throw new Error("Failed to invite collaborator");
  }
}

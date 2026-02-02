import { getBrainDetails } from "@/api/brain-details";
import BrainHeader from "@/app/components/brain/brain-header";
import { shareBrain, inviteCollaborator } from "@/actions/share";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Params = Promise<{ BrainId: string }>;

export default async function BrainLayout(props: {
  children: ReactNode;
  params: Params;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { BrainId } = await props.params;
  const brainDetails = await getBrainDetails(BrainId);

  // Wrapper for server actions to match component signature
  async function onShareToggle(next: boolean) {
    "use server";
    await shareBrain(BrainId, next);
  }

  async function onInvite(email: string) {
    "use server";
    await inviteCollaborator(BrainId, email);
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <BrainHeader
        brainId={BrainId}
        name={brainDetails.name}
        description={brainDetails.description}
        counts={brainDetails.counts}
        isPublic={false} // TODO: Add isPublic to BrainDetails type and backend response
        onShareToggle={onShareToggle}
        onInviteCollaborator={onInvite}
        extensionUrl="https://chromewebstore.google.com/detail/your-extension-id"
      />
      <div className="mt-6">
        {props.children}
      </div>
    </div>
  );
}

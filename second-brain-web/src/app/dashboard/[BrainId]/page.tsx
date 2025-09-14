// import { getBrainAll } from "@/server/queries/brainContent";
// import type { FeedItem } from "@/types/brain";

import { getBrainDetails } from "@/api/brain-details";
import BrainHeader from "@/app/components/brain/brain-header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Params = Promise<{ BrainId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
 

/** Server page for a specific brain's overview. */
export default async function BrainSpecificAllPage(props: {
    params: Params
    searchParams: SearchParams
  }) {

    const session = await auth();
   

    if(!session?.user) {
        redirect("/")
    }


  const val = await props.params;
  const searchParams = await props.searchParams;
  console.log( 'on brain id page',val,searchParams)

  // const items = await getBrainAll(brainId);
  // get all items for that brain and tag them with brainId:all


  const brainDetails = await getBrainDetails(val.BrainId);

const items = []

  return (
    <>
    <div  >
    <BrainHeader
        brainId={val.BrainId}
        name={brainDetails.name}
        description={brainDetails.description}
        counts={brainDetails.counts}
        isPublic
        shareUrl="https://app.example.com/share/atlas-123"
        extensionUrl="https://chromewebstore.google.com/detail/your-extension-id"
      />
    <div>specific brain pagellllll</div>
    </div>
    </>
  );
}

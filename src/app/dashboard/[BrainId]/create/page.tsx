

import CreateItemForm from "@/app/components/brain/CreateItemForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


type Params = Promise<{ BrainId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


/** Server page for creating a new item within a brain. */
export default async function createItemPage(props: {
    params: Params
    searchParams: SearchParams
  }){

    const session = await auth();
   

    if(!session?.user) {
        redirect("/")
    }

    const val = await props.params;
    const searchParams = await props.searchParams;
    console.log( 'on brain id page',val,searchParams)

    

    return <div className="max-w-2xl mx-auto p-4">
    <CreateItemForm
      brainId={val.BrainId}
      // @ts-ignore
      type={searchParams.type}
      redirectUrl={
        
        `/dashboard/${val.BrainId}`
      }
    />
  </div>



}

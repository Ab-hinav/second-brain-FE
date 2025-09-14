// src/app/dashboard/layout.tsx

// import { getBrains } from "@/server/queries/brains";
import { Suspense, type ReactNode } from "react";
import DashboardSidebar from "../components/sidebar/DashboardSidebar";
import { SidebarProvider } from "../components/sidebar/MySidebarProvider";
import { getBrainNav } from "@/api/brain-nav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllTags } from "@/api/all-tags";
import { console } from "inspector";


/**
 * Dashboard server layout: guards auth, fetches brains and tags for the sidebar,
 * and renders children within the responsive shell.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  
    const session = await auth();
   

    if(!session?.user) {
        redirect("/")
    }
  
    const brains = await getBrainNav();
    console.log('brains nav data',brains)
    let tags = await getAllTags();
    // let tags = [{
    //     name: 'test1',
    //     color: 'red'
    // },{
    //     name: 'test2',
    //     color: 'blue'
    // },{
    //     name: 'test2',
    //     color: 'green'
    // },{
    //     name: 'test2',
    //     color: 'blue'
    // },{
    //     name: 'test2',
    //     color: 'blue'
    // }]

  // let brains = [
  //   {
  //       id: "item-1",
  //       name: "First Item",
  //       tweet: true,
  //       link: false,
  //       youtube: false,
  //       other: false,
  //       note: true,
  //       is_default: true
  //   },{
  //       id: "item-2", 
  //       is_default:false,
  //       name: "Second Item",
  //       tweet: false,
  //       link: true,
  //       youtube: false,
  //       other: false,
  //       note: false
  //   }
  // ]
  return (
    <SidebarProvider>
      <div className="md:grid md:grid-cols-6 min-h-screen">
        <Suspense fallback={<div>...loading</div>} >
        <DashboardSidebar brains={brains} tags={tags} />
        </Suspense>
        
        <div className="col-span-5 p-1"  >{children}</div>
      
      </div>
    </SidebarProvider>
  );
}

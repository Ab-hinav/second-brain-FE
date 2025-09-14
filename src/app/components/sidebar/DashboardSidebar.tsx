"use client"
// Dashboard sidebar: brains accordion, quick links, and tags list
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Accordion, AccordionItem, Button, Checkbox, cn, Divider, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";

import type { BrainNav } from "@/types/brain";
import { Brain, LockIcon, MailIcon, Menu } from "lucide-react";
import { useSidebar } from "./MySidebarProvider";

import { BrainCreateModal } from "./BrainCreateModal";
import TagList from "../tag-list";
import { Tags } from "@/api/all-tags";

/** Sidebar shell for the dashboard. Accepts brains and tags pre-fetched on server. */
export default function DashboardSidebar( {brains,tags} : {brains:BrainNav,tags:Tags}) {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();



  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile toggler */}
      <div className="md:hidden flex items-center justify-between px-2 py-2 border-b">
        <Button variant="light" onPress={toggleSidebar} startContent={<Menu size={18} />}>
          {open ? "Hide" : "Show"} Menu
        </Button>
      </div>

      <aside
        className={cn("md:col-span-1 md:shrink-0 border-r bg-content1",
          "md:block" ,{'block':open} , {'hidden':!open}        )} 
      >
        <div className="p-3">
          {brains.length==0 ? (
            <p className="opacity-60">No brains yet.</p>
          ) : (
            <>
            <div className="flex-col space-y-2" >
            <BrainCreateModal></BrainCreateModal>

            <Button className="ml-2" onPress={()=>redirect(`/dashboard/all-items`)} >All Items</Button>
            
            </div>
            <Accordion selectionMode="multiple" defaultExpandedKeys={new Set([brains[0]?.id])}  >
              
              {brains.map(b => (
                <AccordionItem className="block  w-full"  key={b.id}   title={<Link className="w-full"  href={`/dashboard/${b.id}`} > {b.name} </Link>} >
                  <ul className="space-y-1">
                    {(["tweet","video","other","link","note","youtube"] as const).map(section => {
                      
                      if (!b[section]) return null;
                      const href = `/dashboard/${b.id}/${section}`;
                      return (
                        <li key={section}>
                          <Link
                            href={href}
                            className={[
                              "block px-2 py-1 rounded link-colored hover:bg-content2",
                              isActive(href) ? "bg-content2" : ""
                            ].join(" ")}
                          >
                            {section[0].toUpperCase() + section.slice(1)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionItem>
              ))}
            </Accordion>
            </>)}
            <TagList allTags={tags}/>
        </div>
        

      </aside>
    </>
  );
}

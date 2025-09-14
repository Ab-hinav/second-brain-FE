"use client";

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Avatar, Input} from "@heroui/react";
import ThemeSwitcher from "./theme-switcher";
import { Brain } from "lucide-react";
import { useSession } from "next-auth/react";
import * as actions from '@/actions';
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Top navigation bar: shows brand, theme toggle, search (when logged in), and auth actions.
 * Updates the URL search params to drive server-side filtering.
 */
export default function TopNav() {
  const user = useSession();
  const [searchTerm,setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchParams = useSearchParams()
  const pathname = usePathname();
  const {replace} = useRouter()


  // Updates `?search=` param (debounced) and resets pagination
  const handleSearch = (e: FormData) => {

    const params = new URLSearchParams(searchParams);
    const search = debouncedSearchTerm;
    if (typeof search === 'string' && search.trim() !== '') {
      params.set('search', search);
      params.set('page','0');
    }else{
      params.delete('search')
      params.delete('page');
    }

    replace(`${pathname}?${params.toString()}`)

  }


  const authContent =
    user.status == "loading" ? (
      null
    ) : ( user.data?.user ? (
        <form  className="flex space-x-2" action={actions.signOut} >
        <Avatar showFallback src={user.data?.user?.image || ''} name={user.data.user.name || ''} />
        <Button color="secondary" type='submit' >SignOut</Button>
    </form>
    ) : (
      <Button as={Link} href="/auth" color="secondary" radius="sm">
        Sign in
      </Button>
    ));

  // implement search on server side
  const searchContent = (
    <form action={handleSearch} >
      <Input
        type="input"
        placeholder="Search "
        value={searchTerm}
        
        onChange={(e) => setSearchTerm(e.target.value)}
      ></Input>
    </form>
  );

  return (
    <Navbar maxWidth="full" className="shadow dark:bg-gray-800">
      <NavbarBrand as={Link} href="/" className="gap-2 link-colored">
        <Brain className="w-6 h-6" />
        <span className="font-semibold">Second Brain</span>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          {user.data ? (
            searchContent
          ) : (
            <Link href="/dashboard" className="link-colored">
              {"Go to Dashboard"}
            </Link>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>{authContent}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

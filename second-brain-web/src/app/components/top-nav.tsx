"use client";

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";
import ThemeSwitcher from "./theme-switcher";
import { Brain } from "lucide-react";
import { useSession } from "next-auth/react";
import * as actions from '@/actions';

export default function TopNav() {
  const user = useSession();

  const authContent =
    user.status == "loading" ? (
      null
    ) : ( user.data?.user ? (
        <form action={actions.signOut} >
        <Button color="secondary" type='submit' >SignOut</Button>
    </form>
    ) : (
      <Button as={Link} href="/auth" color="secondary" radius="sm">
        Sign in
      </Button>
    ));

  return (
    <Navbar maxWidth="full" className="shadow dark:bg-gray-800">
      <NavbarBrand as={Link} href="/" className="gap-2 link-colored">
        <Brain className="w-6 h-6" />
        <span className="font-semibold">Second Brain</span>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          <Link href="/dashboard" className="link-colored">
            { !user.data ? 'Go to Dashboard' :  `Welcome ${user.data?.user?.name}`}
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
        {authContent}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
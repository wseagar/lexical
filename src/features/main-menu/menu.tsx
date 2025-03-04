"use client";

import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  PanelLeftClose,
  PanelRightClose,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import { UserProfile } from "../user-profile";

import { useSession } from "next-auth/react";
import { UpdateIndicator } from "../change-log/update-indicator";
import { useMenuContext } from "./menu-context";

export const MainMenu = () => {
  const { data: session } = useSession();
  const { isMenuOpen, toggleMenu } = useMenuContext();
  return (
    <div className="flex flex-col justify-between p-2">
      <div className="flex gap-2  flex-col  items-center">
        <Button
          asChild
          className="rounded w-[40px] h-[40px] p-1 text-primary"
          variant={"outline"}
        >
          <Link href="/" title="Home">
            <img src="/ai-icon.png" />
          </Link>
        </Button>
        <Button
          asChild
          className="rounded-full w-[40px] h-[40px] p-2 text-primary"
          variant={"outline"}
        >
          <Link href="/" title="Chat">
            <MessageCircle />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <Button
          asChild
          className="rounded-full w-[40px] h-[40px] p-2 text-primary"
          variant={"outline"}
        >
          <Link href="/learn" title="Learning" className="relative">
            <GraduationCap />
          </Link>
        </Button>
        <UserProfile />
        {session?.user?.isAdmin ? (
          <Button
            asChild
            className="rounded-full w-[40px] h-[40px] p-2 text-primary"
            variant={"outline"}
          >
            <Link href="/admin/models" title="Models">
              <Settings />
            </Link>
          </Button>
        ) : (
          <></>
        )}
        <Button
          onClick={toggleMenu}
          className="rounded-full w-[40px] h-[40px] p-1 text-primary"
          variant={"outline"}
        >
          {isMenuOpen ? <PanelLeftClose /> : <PanelRightClose />}
        </Button>
      </div>
    </div>
  );
};

"use client";
import { useMenuContext } from "@/features/main-menu/menu-context";
import React from "react";
export const SubmenuContainer = ({
  children,
  canClose,
}: {
  children: React.ReactNode;
  canClose?: boolean;
}) => {
  const { isMenuOpen } = useMenuContext();
  return (
    <>
      {(canClose == null || canClose === true ? isMenuOpen : true)
        ? children
        : null}
    </>
  );
};

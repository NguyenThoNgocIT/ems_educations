"use client";
import React from "react";
import {
  LayoutGrid as GridIcon,
} from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const CenterItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Phân quyền (RBAC)",
    path: "/dashboard/admin/rbac",
  },
];

export const LearingItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Học tập",
    path: "/dashboard/admin",
  },
];

export const navItems: NavItem[] = [
  {
    name: "Quản lý",
    icon: <GridIcon />,
    path: "/dashboard/admin",
  },
];

export const othersItems: NavItem[] = [];

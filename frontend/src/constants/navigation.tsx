"use client";
import React from "react";
import {
  GridIcon,
} from "../icons/index";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const CenterItems: NavItem[] = [];

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

"use client";
import React from "react";
import { Files as PageIcon } from "lucide-react";

export type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  pro?: boolean;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const TEACHER_CENTER_ITEMS: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "Tổng quan",
    path: "/dashboard/teacher",
  },
];

export const TEACHER_LEARNING_ITEMS: NavItem[] = [];

import type { LucideIcon } from "lucide-react";
import {
  BarChart2,
  BookOpen,
  Calendar,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: "exact",
  },
  {
    href: "/trades",
    label: "Journal",
    icon: BookOpen,
    match: "prefix",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart2,
    match: "prefix",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: Calendar,
    match: "prefix",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    match: "prefix",
  },
];

export function isNavItemActive(
  pathname: string,
  item: SidebarNavItem
): boolean {
  if (item.match === "exact") {
    return pathname === item.href;
  }

  if (item.href === "/trades") {
    return (
      pathname === "/trades" ||
      pathname.startsWith("/trades/") ||
      pathname === "/add-trade"
    );
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

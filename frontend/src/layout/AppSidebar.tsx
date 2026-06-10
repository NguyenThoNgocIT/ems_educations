"use client";

import { adminNavGroups } from "@/constants/navigation";
import { menuApi } from "@/api/rbac";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import type { MenuItem as RbacMenuItem } from "@/types/rbac";
import {
  Award,
  BookOpen,
  Building,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Circle,
  Clock,
  DoorOpen,
  FileText,
  GraduationCap,
  KeyRound,
  Landmark,
  Layers,
  LayoutDashboard,
  Menu as MenuIcon,
  Network,
  ShieldCheck,
  Target,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SIDEBAR_OPEN_WIDTH = "w-[290px]";
const SIDEBAR_CLOSED_WIDTH = "w-[90px]";

function isActivePath(pathname: string, path: string) {
  return pathname === path || (path !== "/dashboard/admin" && pathname.startsWith(`${path}/`));
}

const MENU_PATH_ALIASES: Record<string, string[]> = {
  "/dashboard/admin": ["/dashboard/admin"],
  "/dashboard/admin/lecturers": ["/dashboard/admin/instructors"],
  "/dashboard/admin/rbac": ["/dashboard/admin/roles", "/dashboard/admin/permissions", "/dashboard/admin/menus"],
  "/dashboard/admin/student-class-assignments": ["/dashboard/admin/student-classes"],
};

function normalizePath(path?: string) {
  if (!path) return "";
  return path.trim().replace(/\/+$/, "");
}

function canShowPath(path: string, allowedPaths: Set<string> | null) {
  if (!allowedPaths) return true;
  const normalized = normalizePath(path);
  const candidates = [normalized, ...(MENU_PATH_ALIASES[normalized] || [])].map(normalizePath);
  return candidates.some((candidate) => allowedPaths.has(candidate));
}

const STATIC_ADMIN_PATHS = new Set(
  adminNavGroups.flatMap((group) =>
    group.items.flatMap((item) => {
      const path = normalizePath(item.path);
      return [path, ...(MENU_PATH_ALIASES[path] || []).map(normalizePath)];
    }),
  ),
);

function normalizeRoleCode(role?: string) {
  return (role || "").toLowerCase().replace(/^role_/, "");
}

function menuKey(menu: RbacMenuItem) {
  return `menu:${menu.id}`;
}

function buildMenuTree(items: RbacMenuItem[], parentId: string | null = null, visited = new Set<string>()): RbacMenuItem[] {
  return items
    .filter((item) => (item.parentId ?? null) === parentId)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map((item) => {
      if (visited.has(item.id)) return { ...item, children: [] };
      const nextVisited = new Set(visited);
      nextVisited.add(item.id);
      return { ...item, children: buildMenuTree(items, item.id, nextVisited) };
    })
    .filter((item) => Boolean(normalizePath(item.path || item.menuUrl)) || (item.children?.length ?? 0) > 0);
}

function flattenMenus(items: RbacMenuItem[]): RbacMenuItem[] {
  return items.flatMap((item) => [item, ...flattenMenus(item.children || [])]);
}

function DynamicMenuIcon({ icon }: { icon?: string }) {
  const className = "h-[18px] w-[18px]";
  const key = (icon || "").toLowerCase();
  switch (key) {
    case "layout-dashboard":
    case "dashboard":
      return <LayoutDashboard className={className} />;
    case "users":
      return <Users className={className} />;
    case "user":
      return <User className={className} />;
    case "book-open":
    case "book":
      return <BookOpen className={className} />;
    case "calendar":
    case "calendar-days":
      return <CalendarDays className={className} />;
    case "landmark":
      return <Landmark className={className} />;
    case "graduation-cap":
      return <GraduationCap className={className} />;
    case "building":
      return <Building className={className} />;
    case "door-open":
      return <DoorOpen className={className} />;
    case "clock":
      return <Clock className={className} />;
    case "layers":
      return <Layers className={className} />;
    case "award":
      return <Award className={className} />;
    case "target":
      return <Target className={className} />;
    case "network":
      return <Network className={className} />;
    case "check-square":
      return <CheckSquare className={className} />;
    case "shield":
    case "shield-check":
      return <ShieldCheck className={className} />;
    case "key":
    case "key-round":
      return <KeyRound className={className} />;
    case "file-text":
      return <FileText className={className} />;
    case "menu":
      return <MenuIcon className={className} />;
    default:
      return <Circle className="h-2.5 w-2.5 fill-current" />;
  }
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();
  const isOpen = isExpanded || isHovered || isMobileOpen;
  const normalizedRoles = [user?.role, ...(user?.roles || [])].map(normalizeRoleCode);
  const isAdmin = Boolean(
    user?.username?.toLowerCase() === "admin"
      || user?.email?.toLowerCase() === "admin@donga.edu.vn"
      || normalizedRoles.some((role) => ["admin", "super_admin"].includes(role)),
  );
  const [allowedPaths, setAllowedPaths] = useState<Set<string> | null>(null);
  const [dynamicMenus, setDynamicMenus] = useState<RbacMenuItem[]>([]);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(["Hồ sơ nhân sự", "Giảng dạy"]));

  useEffect(() => {
    let mounted = true;

    if (isAdmin) {
      setAllowedPaths(null);
      setDynamicMenus([]);
      return () => {
        mounted = false;
      };
    }

    menuApi.getMe()
      .then((menus) => {
        if (!mounted) return;
        const paths = new Set(
          menus
            .map((menu) => normalizePath(menu.path || menu.menuUrl))
            .filter((path): path is string => Boolean(path)),
        );
        paths.add("/dashboard/admin");
        setAllowedPaths(paths);
        setDynamicMenus(buildMenuTree(menus));
      })
      .catch(() => {
        if (mounted) {
          setAllowedPaths(null);
          setDynamicMenus([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    const activeGroup = adminNavGroups.find((group) =>
      group.items.some((item) => isActivePath(pathname, item.path)),
    );

    if (activeGroup && activeGroup.items.length > 1) {
      setOpenGroups((current) => {
        const next = new Set(current);
        next.add(activeGroup.groupName);
        return next;
      });
    }
  }, [pathname]);

  useEffect(() => {
    const activeRoot = dynamicMenus.find((menu) =>
      (menu.children || []).some((child) => {
        const childPath = normalizePath(child.path || child.menuUrl);
        return childPath && isActivePath(pathname, childPath);
      }),
    );

    if (activeRoot) {
      setOpenGroups((current) => {
        const next = new Set(current);
        next.add(menuKey(activeRoot));
        return next;
      });
    }
  }, [dynamicMenus, pathname]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const renderDynamicLink = (item: RbacMenuItem, compact = false) => {
    const path = normalizePath(item.path || item.menuUrl);
    if (!path) return null;
    const active = isActivePath(pathname, path);

    if (compact) {
      return (
        <Link
          key={item.id}
          href={path}
          className={cn(
            "group/item relative flex h-9 items-center justify-between rounded-lg px-2.5 text-[13px] transition-colors",
            active
              ? "bg-primary/10 font-semibold text-primary"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                active ? "bg-primary" : "bg-muted-foreground/35 group-hover/item:bg-foreground/50",
              )}
            />
            <span className="truncate">{item.name || item.menuTitle}</span>
          </span>
        </Link>
      );
    }

    return (
      <Link
        key={item.id}
        href={path}
        title={!isOpen ? item.name || item.menuTitle : undefined}
        className={cn(
          "group relative flex h-11 items-center rounded-xl text-sm font-semibold transition-all duration-200",
          isOpen ? "justify-start gap-3 px-3" : "justify-center px-0",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg">
          <DynamicMenuIcon icon={item.icon || item.menuIcon} />
        </span>
        <span
          className={cn(
            "min-w-0 truncate transition-all duration-200",
            isOpen ? "opacity-100" : "pointer-events-none w-0 overflow-hidden opacity-0",
          )}
        >
          {item.name || item.menuTitle}
        </span>
      </Link>
    );
  };

  const renderDynamicMenu = (item: RbacMenuItem) => {
    const children = item.children || [];
    const hasChildren = children.length > 0;
    if (!hasChildren) return renderDynamicLink(item);

    const groupActive = children.some((child) => {
      const childPath = normalizePath(child.path || child.menuUrl);
      return childPath && isActivePath(pathname, childPath);
    });
    const key = menuKey(item);
    const groupOpen = isOpen && openGroups.has(key);

    return (
      <section key={item.id} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleGroup(key)}
          aria-expanded={groupOpen}
          title={!isOpen ? item.name || item.menuTitle : undefined}
          className={cn(
            "group relative flex h-11 w-full items-center rounded-xl text-sm font-semibold transition-all duration-200",
            isOpen ? "justify-between px-3" : "justify-center px-0",
            groupActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span
            className={cn(
              "absolute left-0 h-6 w-1 rounded-r-full bg-primary transition-opacity",
              groupActive ? "opacity-100" : "opacity-0",
            )}
          />
          <span className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                groupActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              <DynamicMenuIcon icon={item.icon || item.menuIcon} />
            </span>
            <span
              className={cn(
                "truncate transition-all duration-200",
                isOpen ? "opacity-100" : "pointer-events-none w-0 overflow-hidden opacity-0",
              )}
            >
              {item.name || item.menuTitle}
            </span>
          </span>
          {isOpen && (
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                groupOpen ? "rotate-0" : "-rotate-90",
                groupActive && "text-primary",
              )}
            />
          )}
        </button>

        {groupOpen && (
          <div className="ml-4 space-y-0.5 border-l border-border/80 pl-3">
            {children.map((child) => renderDynamicLink(child, true))}
          </div>
        )}
      </section>
    );
  };

  const customDynamicMenus = flattenMenus(dynamicMenus)
    .filter((menu) => {
      const path = normalizePath(menu.path || menu.menuUrl);
      return path && !STATIC_ADMIN_PATHS.has(path);
    })
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border/80 bg-background shadow-sm transition-all duration-300 ease-in-out",
        isOpen ? SIDEBAR_OPEN_WIDTH : SIDEBAR_CLOSED_WIDTH,
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      {/* Logo Section */}
      <div className="h-[80px] border-b border-gray-100 flex items-center justify-center px-4 overflow-hidden dark:border-slate-800 flex-shrink-0">
        <Link href="/dashboard/admin" className="relative flex items-center justify-center w-full h-full">
          {isOpen ? (
            <div className="relative w-[310px] h-[88px] transition-all duration-300 flex items-center justify-center">
              <Image
                src="/images/logo/logo-sidebar-admin-big.png"
                alt="Đại Học Đông Á"
                fill
                priority
                sizes="310px"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="relative w-9 h-9 transition-all duration-300">
              <Image
                src="/images/logo/logo-sidebar-admin-small.png"
                alt="UDA"
                fill
                priority
                sizes="36px"
                className="object-contain"
              />
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="space-y-1.5">
          {adminNavGroups.map((group, groupIndex) => {
            const visibleItems = group.items.filter((item) => canShowPath(item.path, allowedPaths));
            if (visibleItems.length === 0) return null;

            const groupActive = visibleItems.some((item) => isActivePath(pathname, item.path));
            const canCollapse = visibleItems.length > 1;
            const dashboardItem = !canCollapse ? visibleItems[0] : null;
            const groupOpen = canCollapse && isOpen && openGroups.has(group.groupName);

            if (dashboardItem) {
              const active = isActivePath(pathname, dashboardItem.path);

              return (
                <Link
                  key={group.groupName || groupIndex}
                  href={dashboardItem.path}
                  title={!isOpen ? dashboardItem.name : undefined}
                  className={cn(
                    "group relative flex h-11 items-center rounded-xl text-sm font-semibold transition-all duration-200",
                    isOpen ? "justify-start gap-3 px-3" : "justify-center px-0",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg">
                    {group.icon}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 truncate transition-all duration-200",
                      isOpen ? "opacity-100" : "pointer-events-none w-0 overflow-hidden opacity-0",
                    )}
                  >
                    {dashboardItem.name}
                  </span>
                </Link>
              );
            }

            return (
              <section key={group.groupName || groupIndex} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.groupName)}
                  aria-expanded={groupOpen}
                  title={!isOpen ? group.groupName : undefined}
                  className={cn(
                    "group relative flex h-11 w-full items-center rounded-xl text-sm font-semibold transition-all duration-200",
                    isOpen ? "justify-between px-3" : "justify-center px-0",
                    groupActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 h-6 w-1 rounded-r-full bg-primary transition-opacity",
                      groupActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        groupActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {group.icon}
                    </span>
                    <span
                      className={cn(
                        "truncate transition-all duration-200",
                        isOpen ? "opacity-100" : "pointer-events-none w-0 overflow-hidden opacity-0",
                      )}
                    >
                      {group.groupName}
                    </span>
                  </span>
                  {isOpen && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        groupOpen ? "rotate-0" : "-rotate-90",
                        groupActive && "text-primary",
                      )}
                    />
                  )}
                </button>

                {groupOpen && (
                  <div className="ml-4 space-y-0.5 border-l border-border/80 pl-3">
                    {visibleItems.map((item) => {
                      const active = isActivePath(pathname, item.path);

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            "group/item relative flex h-9 items-center justify-between rounded-lg px-2.5 text-[13px] transition-colors",
                            active
                              ? "bg-primary/10 font-semibold text-primary"
                              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={cn(
                                "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                                active ? "bg-primary" : "bg-muted-foreground/35 group-hover/item:bg-foreground/50",
                              )}
                            />
                            <span className="truncate">{item.name}</span>
                          </span>
                          {item.badge && (
                            <span
                              className={cn(
                                "ml-2 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                                active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          {customDynamicMenus.length > 0 && (
            <section className="space-y-1">
              {customDynamicMenus.map((menu) => renderDynamicLink(menu))}
            </section>
          )}
        </div>
      </nav>

      <div className="shrink-0 border-t border-border/80 p-3">
        <div
          className={cn(
            "rounded-xl border border-primary/15 bg-primary/5 text-primary",
            isOpen ? "p-3" : "flex h-11 items-center justify-center",
          )}
        >
          {isOpen ? (
            <div>
              <p className="text-xs font-semibold">Hệ thống đang hoạt động</p>
              <p className="mt-0.5 text-[11px] text-primary/75">UEMS Admin Console</p>
            </div>
          ) : (
            <span className="size-2 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </aside>
  );
}

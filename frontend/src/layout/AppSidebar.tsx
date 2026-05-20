"use client";

import { adminNavGroups } from "@/constants/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_OPEN_WIDTH = "w-[290px]";
const SIDEBAR_CLOSED_WIDTH = "w-[90px]";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();
  const isOpen = isExpanded || isHovered || isMobileOpen;

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
      <div className="flex h-20 shrink-0 items-center border-b border-border/80 px-4">
        <Link
          href="/dashboard/admin"
          className={cn(
            "flex min-w-0 items-center gap-3 rounded-xl transition-colors hover:bg-muted/60",
            isOpen ? "w-full px-2 py-2" : "mx-auto justify-center p-2",
          )}
          title="UEMS"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span
            className={cn(
              "min-w-0 transition-all duration-200",
              isOpen ? "opacity-100" : "pointer-events-none w-0 overflow-hidden opacity-0",
            )}
          >
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
              UEMS
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              Quản lý đào tạo đại học
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="space-y-5">
          {adminNavGroups.map((group, groupIndex) => (
            <section key={group.groupName || groupIndex} className="space-y-1">
              {isOpen ? (
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.groupName}
                </div>
              ) : (
                groupIndex > 0 && <div className="mx-auto my-3 h-px w-8 bg-border" />
              )}

              {group.items.map((item) => {
                const active = pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    title={!isOpen ? item.name : undefined}
                    className={cn(
                      "group relative flex h-11 items-center rounded-xl text-sm transition-all duration-200",
                      isOpen ? "justify-between px-3" : "justify-center px-0",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 h-6 w-1 rounded-r-full bg-primary transition-opacity",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "truncate font-medium transition-all duration-200",
                          isOpen ? "opacity-100" : "pointer-events-none w-0 overflow-hidden opacity-0",
                        )}
                      >
                        {item.name}
                      </span>
                    </span>

                    {isOpen && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 shrink-0 transition-all",
                          active ? "translate-x-0.5 text-primary" : "text-muted-foreground/70",
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </section>
          ))}
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

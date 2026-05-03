'use client';


import { useSession } from "next-auth/react";
import { Bell, Search, Sun, Moon, ChevronDown, Settings, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/ai-agents": "AI Agents",
  "/automation": "Automation Flows",
  "/energy": "Energy & IoT",
  "/analytics": "Analytics",
  "/investors": "Investor Analytics",
  "/team": "Projects & Teams",
  "/financial": "Financial Intelligence",
  "/integrations": "Integrations",
  "/reports": "Reports",
  "/billing": "Billing",
  "/settings": "Settings",
};

const notifications = [
  { id: "1", title: "AI Agent completed task", desc: "Sales Agent closed 3 leads", time: "2m ago", unread: true },
  { id: "2", title: "Energy alert resolved", desc: "Inverter-07 back online", time: "15m ago", unread: true },
  { id: "3", title: "New team member", desc: "Alex Rivera joined Engineering", time: "1h ago", unread: false },
];

export function TopBar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pageTitle = breadcrumbMap[pathname] ?? "Dashboard";
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6 shrink-0 z-10">
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-semibold leading-none">{pageTitle}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">NexoraGrid Command Center</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-sm">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs">Search...</span>
          <kbd className="hidden sm:inline text-[10px] bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-background" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="text-xs text-indigo-500 cursor-pointer hover:text-indigo-400">Mark all read</span>
              </div>
              <div className="divide-y divide-border max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${n.unread ? "bg-indigo-500/5" : ""}`}>
                    <div className="flex items-start gap-3">
                      {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
                      <div className={n.unread ? "" : "ml-4"}>
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-muted-foreground">{n.desc}</div>
                        <div className="text-xs text-muted-foreground/60 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <Link href="/notifications" className="text-xs text-indigo-500 hover:text-indigo-400">View all notifications</Link>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade badge */}
        <Link href="/billing"
          className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/20 text-indigo-400 hover:border-indigo-500/40 transition-all text-xs font-medium">
          <Zap className="w-3 h-3" />
          Upgrade
        </Link>

        {/* User avatar */}
        <div className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            {(session?.user?.name ?? "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
        </div>
      </div>
    </header>
  );
}

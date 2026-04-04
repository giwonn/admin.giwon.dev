"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/", label: "대시보드", icon: "H" },
  { href: "/articles", label: "글 관리", icon: "A" },
  { href: "/articles/new", label: "글 작성", icon: "+" },
  { href: "/analytics", label: "분석", icon: "G" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="px-4 py-5 border-b border-gray-700">
        <Link href="/" className="text-lg font-bold">Blog Admin</Link>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center text-xs bg-gray-700 rounded">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

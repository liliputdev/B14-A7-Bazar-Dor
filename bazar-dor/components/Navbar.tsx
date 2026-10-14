"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/api";

export default function Navbar({
  categories,
  date,
}: {
  categories: Category[];
  date: string;
}) {
  const pathname = usePathname();

  return (
    <header className="bg-white">
      {/* Row 1: Logo + Authentication */}
      <div className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={44}
              height={44}
              priority
              className="size-11 shrink-0 object-contain"
            />

            <span>
              <span className="block text-lg font-bold leading-tight text-gray-900">
                বাজার দর
              </span>
              <span className="block text-xs text-gray-500">
                {date}
              </span>
            </span>
          </Link>

          {/* Authentication buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="btn btn-sm btn-ghost sm:btn-md"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="btn btn-sm border-0 bg-green-600 text-white hover:bg-green-700 sm:btn-md"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Category Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 md:justify-center">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;

            return (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-green-50 font-semibold text-green-700"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }`}
              >
                <span>{c.icon}</span>
                {c.nameBn}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
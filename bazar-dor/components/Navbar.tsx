"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Category } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar({
  categories,
  date,
}: {
  categories: Category[];
  date: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSigningOut(false);
    }
  };

  const displayName = session?.user.name || session?.user.email || "আমার অ্যাকাউন্ট";

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

          <div className="flex items-center gap-2">
            {isPending ? (
              <span
                className="h-9 w-20 animate-pulse rounded-full bg-gray-100"
                aria-label="সেশন লোড হচ্ছে"
              />
            ) : session ? (
              <details className="dropdown dropdown-end">
                <summary
                  className="btn btn-ghost btn-sm flex h-10 gap-2 rounded-full px-2"
                  aria-label="অ্যাকাউন্ট মেনু"
                >
                  <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt=""
                        fill
                        sizes="32px"
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="size-5"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M5 21a7 7 0 0 1 14 0" />
                      </svg>
                    )}
                  </span>
                  <span className="hidden max-w-28 truncate sm:inline">
                    {displayName}
                  </span>
                  <span aria-hidden="true">⌄</span>
                </summary>

                <div className="dropdown-content z-50 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
                  <div className="border-b border-gray-100 px-2 pb-3">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {session.user.name || "ব্যবহারকারী"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="mt-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <span aria-hidden="true">👤</span>
                    আমার প্রোফাইল
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <span aria-hidden="true">↪</span>
                    {isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
                  </button>
                </div>
              </details>
            ) : (
              <>
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
              </>
            )}
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
                key={c.slug ?? c.id ?? c._id}
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
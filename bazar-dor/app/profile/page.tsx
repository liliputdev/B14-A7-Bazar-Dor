
"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#eff5f0] flex items-center justify-center">
        <p className="text-gray-500">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#eff5f0] flex items-center justify-center p-5">
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <h1 className="font-bold text-xl">সাইন ইন প্রয়োজন</h1>
          <p className="text-gray-500 text-sm my-3">
            প্রোফাইল দেখতে প্রথমে সাইন ইন করুন।
          </p>
          <Link
            href="/signin"
            className="inline-block bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            সাইন ইন
          </Link>
        </div>
      </main>
    );
  }

  const user = session.user;

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      toast.success("আপনার তথ্য আপডেট হয়েছে");
      router.refresh();
    } catch {
      toast.error("তথ্য আপডেট করা যায়নি");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eff5f0] px-4 py-10">
      <div className="max-w-[600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-xl font-bold text-green-700">
            বাজার দর
          </Link>
        </div>

        <section className="bg-white border border-[#e1e9e2] rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-bold text-[#26332b] mb-6">
            আমার প্রোফাইল
          </h1>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e1e9e2] bg-[#fbfdfb] p-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-700">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt=""
                    fill
                    sizes="48px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="size-7"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="break-all text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              disabled={signingOut}
              className="shrink-0 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60"
            >
              {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
            </button>
          </div>

          <div className="border-t pt-5">
            <h2 className="font-bold mb-4">নাম আপডেট করুন</h2>

            <form onSubmit={handleUpdate}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user.name || "আপনার নাম"}
                required
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />

              <button
                type="submit"
                disabled={saving}
                className="mt-4 w-full h-11 bg-[#078b43] hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-bold"
              >
                {saving ? "আপডেট হচ্ছে..." : "নাম আপডেট করুন"}
              </button>
            </form>
          </div>
        </section>

        <div className="text-center mt-5">
          <Link href="/" className="text-sm text-green-700 font-semibold">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}

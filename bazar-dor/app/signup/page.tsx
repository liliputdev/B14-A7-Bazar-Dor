
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();

    if (form.password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password: form.password,
      });

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে!");
      router.push("/signin");
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: "google" | "github") => {
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "লগইন করা যায়নি");
      }
    } catch {
      toast.error("লগইন করা যায়নি");
    }
  };

  return (
    <main className="min-h-screen bg-[#eff5f0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[430px]">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-green-700">
            বাজার দর
          </Link>
          <h1 className="text-xl font-bold text-[#26332b] mt-5">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            আপনার অ্যাকাউন্ট তৈরি করতে তথ্য দিন
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e1e9e2] rounded-xl p-6 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">নাম</label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="আপনার সম্পূর্ণ নাম"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">ইমেইল</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                পাসওয়ার্ড
              </label>
              <input
                required
                minLength={8}
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                required
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="আবার পাসওয়ার্ড লিখুন"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#078b43] hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-bold mt-5"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>

          <div className="flex items-center gap-3 my-5 text-xs text-gray-400">
            <div className="h-px bg-gray-200 flex-1" />
            অথবা
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => socialLogin("google")}
              className="border rounded-lg py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Google
            </button>

            <button
              type="button"
              onClick={() => socialLogin("github")}
              className="border rounded-lg py-3 text-sm font-semibold hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            অ্যাকাউন্ট আছে?{" "}
            <Link href="/signin" className="text-green-700 font-bold">
              সাইন ইন করুন
            </Link>
          </p>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
      </div>
    </main>
  );
}

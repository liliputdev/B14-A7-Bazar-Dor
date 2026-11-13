
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

    if (loading) return;

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    if (!email) {
      toast.error("আপনার ইমেইল লিখুন");
      return;
    }

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
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password: form.password,
        callbackURL: "/profile",
      });

      if (error) {
        console.error("Signup API error:", error);
        const errMsg = (error.message ?? "").toLowerCase();
        const friendlyMsg =
          errMsg.includes("user already exists") ||
          errMsg.includes("email already")
            ? "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি হয়েছে। সাইন ইন করুন।"
            : errMsg.includes("password")
            ? "পাসওয়ার্ড যথেষ্ট শক্তিশালী নয়"
            : "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";
        toast.error(friendlyMsg);
        return;
      }

      if (!data) {
        toast.error("অ্যাকাউন্ট তৈরি নিশ্চিত করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      router.replace("/profile");
      router.refresh();
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });

      if (error) {
        console.error("Google signup error:", error);
        toast.error("Google দিয়ে অ্যাকাউন্ট তৈরি করা যায়নি");
        setLoading(false);
      }
    } catch (error) {
      console.error("Google signup failed:", error);
      toast.error("Google দিয়ে অ্যাকাউন্ট তৈরি করা যায়নি");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eff5f0] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[430px]">

        {/* Header */}
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

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e1e9e2] rounded-xl p-6 shadow-sm"
        >
          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                নাম
              </label>

              <input
                required
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="আপনার সম্পূর্ণ নাম"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                ইমেইল
              </label>

              <input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="you@example.com"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                পাসওয়ার্ড
              </label>

              <input
                required
                minLength={8}
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                required
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="আবার পাসওয়ার্ড লিখুন"
                className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-green-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#078b43] hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-bold mt-5"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-xs text-gray-400">
            <div className="h-px bg-gray-200 flex-1" />
            অথবা
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={googleSignup}
            disabled={loading}
            className="w-full border rounded-lg py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google দিয়ে সাইন আপ
          </button>

          {/* Signin Link */}
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

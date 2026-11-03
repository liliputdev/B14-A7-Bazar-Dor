
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SigninPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: cleanEmail,
        password,
        callbackURL: "/profile",
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড ভুল");
        return;
      }

      if (!data) {
        toast.error("লগইন নিশ্চিত করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");

      router.replace("/profile");
      router.refresh();
    } catch (err) {
      console.error("Login request failed:", err);
      toast.error("লগইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });

      if (error) {
        console.error("Google login error:", error);
        toast.error(error.message || "Google দিয়ে লগইন করা যায়নি");
        setLoading(false);
      }
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Google login failed");
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
            সাইন ইন
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e1e9e2] rounded-xl p-6 shadow-sm"
        >
          <div className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                ইমেইল
              </label>

              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড"
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
            {loading ? "প্রবেশ করছেন..." : "সাইন ইন"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-xs text-gray-400">
            <div className="h-px bg-gray-200 flex-1" />
            অথবা
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={googleLogin}
            disabled={loading}
            className="w-full border rounded-lg py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            Continue with Google
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/signup" className="text-green-700 font-bold">
              অ্যাকাউন্ট তৈরি করুন
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

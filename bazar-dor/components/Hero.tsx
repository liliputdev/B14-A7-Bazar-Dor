import Image from "next/image";

export default function Hero() {
  return (
    <section className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
      {/* Text */}
      <div className="text-center md:text-left">
        <p className="mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          মঙ্গলবার, ৬ অক্টোবর, ২০২৬
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          আজকের বাজারের দাম এক নজরে 
        </h1>
        <p className="mt-4 text-gray-600">
         চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        <a
          href="#সব-পণ্য"
          className="btn btn-sm sm:btn-md mt-6 border-0 bg-green-600 text-white hover:bg-green-700"
        >
          সব পণ্য দেখুন
        </a>
      </div>

      {/* Image */}
      <div className="order-first md:order-last">
        <Image
          src="/bazar-hero.png"
          alt="বাজার দর"
          width={640}
          height={480}
          priority
          className="mx-auto h-auto w-full max-w-md md:max-w-none"
        />
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import type { Category } from "@/lib/api";

export default function NavbarWithDate({
  categories,
}: {
  categories: Category[];
}) {
  const [today, setToday] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setToday(
        new Date().toLocaleDateString("bn-BD", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateDate();

    const timer = setInterval(updateDate, 60_000);

    return () => clearInterval(timer);
  }, []);

  return <Navbar categories={categories} date={today} />;
}

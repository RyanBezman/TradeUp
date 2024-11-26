"use client";

import { useAuth } from "@/app/context/AuthContext";
import { MoonIcon, SunIcon } from "lucide-react";

export function ToggleTheme() {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-violet-300 dark:bg-zinc-700 hidden min-[505px]:block"
    >
      <SunIcon
        className={`h-5 w-5 text-violet-800 ${
          theme === "light" ? "block" : "hidden"
        }`}
      />
      <MoonIcon
        className={`h-5 w-5 text-white ${
          theme === "dark" ? "block" : "hidden"
        }`}
      />
    </button>
  );
}

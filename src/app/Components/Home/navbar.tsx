import Link from "next/link";
import { SignInButton } from "./signInButton";
import { ToggleTheme } from "./toggleTheme";
import { ChartNoAxesCombined } from "lucide-react";

const buttons = ["Benefits", "Features", "Pricing", "Testimonials", "FAQ's"];

export function Navbar() {
  return (
    <header className="flex w-full items-center border-b dark:border-gray-600 border-gray-300 justify-between px-12 py-8">
      <div className="flex gap-2 items-center">
        <ChartNoAxesCombined
          className="h-10 w-10 cursor-pointer text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400
"
        />
        <h1 className="font-bold dark:text-white text-black text-3xl cursor-pointer">
          <Link href={"/"}>TradeUp</Link>
        </h1>
      </div>

      <div className="gap-12 min-[1220px]:gap-24 hidden lg:flex">
        {buttons.map((name) => {
          return (
            <button
              className="dark:text-gray-400 text-black hover:dark:text-white hover:text-violet-600 font-semibold text-xl"
              key={name}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <ToggleTheme />
        <SignInButton />
      </div>
    </header>
  );
}

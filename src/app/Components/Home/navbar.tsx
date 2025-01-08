import Link from "next/link";
import { SignInButton } from "./signInButton";
import { ToggleTheme } from "./toggleTheme";
import { ChartNoAxesCombined } from "lucide-react";
import { HamburgerMenu } from "./hamburgerMenu";

const buttons = ["Benefits", "Features", "Pricing", "Testimonials", "FAQ's"];

export function Navbar() {
  return (
    <header className="flex w-full items-center relative dark:border-gray-600 border-gray-300 justify-between px-1 min-[825px]:px-5 py-6">
      <div className="flex items-end">
        <Link href={"/account/home"}>
          <ChartNoAxesCombined
            className="h-10 w-10 cursor-pointer hidden min-[825px]:block text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400
"
          />
        </Link>

        <HamburgerMenu />
        <Link href={"/account/home"}>
          <h1 className="font-bold min-[505px]:block dark:text-white text-black text-3xl pl-2 cursor-pointer">
            TradeUp
          </h1>
        </Link>
      </div>
      <div className="gap-12 min-[1264px]:gap-24 hidden min-[1063px]:flex ">
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

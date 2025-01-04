import Link from "next/link";
import { SignInButton } from "./signInButton";
import { ToggleTheme } from "./toggleTheme";
import { ChartNoAxesCombined, Menu } from "lucide-react";

const buttons = ["Benefits", "Features", "Pricing", "Testimonials", "FAQ's"];
type NavbarProps = {
  isHamburgerOpen: boolean;
  setIsHamburgerOpen: (param: boolean) => void;
};
export function Navbar({ isHamburgerOpen, setIsHamburgerOpen }: NavbarProps) {
  return (
    <header className="flex w-full items-center  dark:border-gray-600 border-gray-300 justify-between px-1 min-[825px]:px-8 py-6">
      <div className="flex gap-2 items-center">
        <Link href={"/account/home"}>
          <ChartNoAxesCombined
            className="h-10 w-10 cursor-pointer hidden min-[825px]:block text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400
"
          />
        </Link>

        <Menu className="h-10 w-10 min-[825px]:hidden text-violet-800 dark:text-white hover:text-violet-600 dark:hover:text-gray-400 cursor-pointer" />
        <Link href={"/account/home"}>
          <h1 className="hidden font-bold min-[505px]:block dark:text-white text-black text-3xl  cursor-pointer">
            TradeUp
          </h1>
        </Link>
      </div>
      <div className="gap-12 min-[1220px]:gap-24 hidden min-[1063px]:flex ">
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

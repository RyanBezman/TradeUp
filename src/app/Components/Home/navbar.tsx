import Link from "next/link";
import { SignInButton } from "./signInButton";
import { ToggleTheme } from "./toggleTheme";
import { HamburgerMenu } from "./hamburgerMenu";

const links = [
  { label: "How to use", href: "/how-to-use" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ's", href: "/faqs" },
];

export function Navbar() {
  return (
    <header className="flex w-full items-center relative dark:border-gray-600 border-gray-300 justify-between px-1 min-[856px]:px-5 py-2 min-[856px]:py-6">
      <div className="flex items-end">
        <HamburgerMenu />
        <Link href={"/"}>
          <h1 className="font-bold min-[505px]:block dark:text-white text-black text-3xl pl-2 cursor-pointer">
            TradeUp
          </h1>
        </Link>
      </div>
      <div className="gap-12 min-[1264px]:gap-24 hidden min-[1063px]:flex ">
        {links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="dark:text-gray-400 text-black hover:dark:text-white hover:text-violet-600 font-semibold text-xl"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <ToggleTheme />
        <SignInButton />
      </div>
    </header>
  );
}

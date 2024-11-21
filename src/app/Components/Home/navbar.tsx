import Link from "next/link";
import { SignInButton } from "./signInButton";

const buttons = ["Benefits", "Features", "Pricing", "Testimonials", "FAQ's"];

export function Navbar() {
  return (
    <header className="flex w-full items-center border-b border-gray-600 justify-between px-12 py-8">
      <h1 className="font-bold text-white text-3xl cursor-pointer">
        <Link href={"/"}>TradeUp</Link>
      </h1>
      <div className=" gap-12 min-[1220px]:gap-24 hidden  lg:flex">
        {buttons.map((name) => {
          return (
            <button
              className="text-gray-400 hover:text-white  font-semibold text-xl"
              key={name}
            >
              {name}
            </button>
          );
        })}
      </div>
      <SignInButton />
    </header>
  );
}

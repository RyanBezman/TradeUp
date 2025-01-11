import { SignUpButton } from "./signUpButton";
import Image from "next/image";

export function Hero() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-10 p-4 sm:p-10">
        <h1 className="text-2xl f sm:text-7xl relative max-w-5xl text-center text-black dark:text-white font-semibold">
          Trade Smarter, Faster, and Securely with TradeUp
          <div className="absolute hidden min-[900px]:inline top-80 -left-10">
            <Image
              src="/Images/leftTilt.png"
              height={471}
              width={246}
              alt="iPhone image tilted left"
            />
            <div className="absolute  bottom-0 left-0 right-0 h-[50%]  bg-gradient-to-b from-transparent via-transparent to-white dark:to-black  "></div>
          </div>
          <div className="absolute hidden min-[900px]:inline top-80 -right-10">
            <Image
              src="/Images/MobileUI.png"
              alt="iPhone image tilted right"
              height={470}
              width={236}
            />
            <div className="absolute  bottom-0 left-0 right-0 h-[10%]   bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>
          </div>
        </h1>
        <h2 className="text-sm sm:text-xl max-w-2xl text-center dark:text-gray-400 font-semibold">
          Join TradeUp to trade confidently with real-time market data, secure
          transactions, and advanced analytics.
        </h2>
      </div>
      <SignUpButton />
    </div>
  );
}

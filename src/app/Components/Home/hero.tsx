import { SignUpButton } from "./signUpButton";

export function Hero() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-10 p-10">
        <h1 className="text-7xl relative max-w-5xl text-center text-black dark:text-white font-semibold">
          Trade Smarter, Faster, and Securely with TradeUp
          <div className="absolute hidden tablet:block top-80 -left-10">
            <img
              src="/Images/wallahi.png"
              className="h-[471px] w-[246px] relative"
              alt=""
            />
            <div className="absolute  bottom-0 left-0 right-0 h-[50%]  bg-gradient-to-b from-transparent via-transparent to-white dark:to-black  "></div>
          </div>
          <div className="absolute hidden tablet:block top-80 -right-10">
            <img
              src="/Images/MobileUI.png"
              className="h-[470px] w-[236px] relative"
              alt=""
            />
            <div className="absolute  bottom-0 left-0 right-0 h-[10%]   bg-gradient-to-b from-transparent via-transparent to-white dark:to-black"></div>
          </div>
        </h1>
        <h2 className="text-xl max-w-2xl text-center text-gray-700 dark:text-gray-400 font-semibold">
          Join TradeUp to trade confidently with real-time market data, secure
          transactions, and advanced analytics.
        </h2>
      </div>
      <SignUpButton />
    </div>
  );
}

import { SignUpButton } from "./signUpButton";

export function Hero() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center gap-10 p-10">
        <h1 className="text-7xl relative max-w-5xl text-center text-black dark:text-white font-semibold">
          Trade Smarter, Faster, and Securely with TradeUp
          <img
            src="/Images/third.png"
            className="absolute hidden -left-10 tablet:block top-80 h-[471px] w-[296px]"
            alt=""
          />
          <img
            src="/Images/MobileUI.png"
            className="absolute hidden -right-10 tablet:block top-80 h-[470px] w-[236px]"
            alt=""
          />
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

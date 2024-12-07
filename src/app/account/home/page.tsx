import DynamicInput from "@/app/Components/Account/dynamicInput";
import Account from "../page";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <Account>
      <HomeLayout />
    </Account>
  );
}

export function HomeLayout() {
  return (
    <div className="bg-whitedark:bg-black rounded-xl flex flex-col p-8 flex-1">
      <h2 className="text-2xl font-bold mb-6 pt-8 dark:text-white text-black">
        Home
      </h2>
      <div className="max-w-sm">
        <div className="flex items-center">
          <DynamicInput />
        </div>

        <div className="flex bg-violet-800 rounded-full w-fit dark:bg-white">
          <button className="bg-violet-800 dark:bg-white text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:bg-violet-700 dark:hover:bg-gray-300 ">
            Buy
          </button>
          <button className="bg-violet-800 dark:bg-white text-white dark:text-black py-2  px-4 rounded-full font-semibold hover:bg-violet-700  dark:hover:bg-gray-300">
            Sell
          </button>
          <button className="bg-violet-800 dark:bg-white text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:bg-violet-700 dark:hover:bg-gray-300">
            Convert
          </button>
        </div>
        <div className="p-2 mt-6 flex items-center gap-2 w-full">
          <img
            className="max-h-8"
            src="https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png"
            alt=""
          />
          <div className="flex flex-col cursor-pointer dark:text-white">
            <label htmlFor="somethign">Buy</label>
            <span>Bitcoin</span>
          </div>
          <span className="pl-10 cursor-pointer dark:text-white">
            <ChevronRight />
          </span>
        </div>
      </div>
    </div>
  );
}

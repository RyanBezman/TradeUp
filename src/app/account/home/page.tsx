import DynamicInput from "@/app/Components/Account/dynamicInput";
import Account from "../page";

export default function Home() {
  return (
    <Account>
      <div className="bg-white dark:bg-black rounded-xl flex flex-col p-8 flex-1">
        <h2 className="text-2xl font-bold mb-6 pt-8 dark:text-white text-black">
          Home
        </h2>
        <div className="max-w-sm">
          <div className="flex items-center">
            <DynamicInput />
          </div>

          <div className="flex bg-violet-800 rounded-full w-fit dark:bg-white">
            <button className="bg-violet-800 dark:bg-white text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:bg-violet-700 dark:hover:bg-gray-300">
              Buy
            </button>
            <button className="bg-violet-800 dark:bg-white text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:bg-violet-700 dark:hover:bg-gray-300">
              Sell
            </button>
            <button className="bg-violet-800 dark:bg-white text-white dark:text-black py-2 px-4 rounded-full font-semibold hover:bg-violet-700 dark:hover:bg-gray-300">
              Convert
            </button>
          </div>
        </div>
      </div>
    </Account>
  );
}

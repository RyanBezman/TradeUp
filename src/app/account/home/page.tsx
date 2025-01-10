import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white w-full min-h-screen flex flex-col overflow-y-auto">
      <section className="  text-center py-16 px-6">
        <h1 className="text-5xl font-semibold text-violet-800 dark:text-white mb-4">
          Welcome Back to TradeUp
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Manage your trades, update your profile, and stay connected with
          real-time market data.
        </p>
      </section>

      <section className="py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-violet-800 dark:text-white">
              10k+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Active Traders</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-violet-800 dark:text-white">
              500M+
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Trades Processed</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-violet-800 dark:text-white">
              99.9%
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Uptime Guarantee</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl w-full mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-md shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <Link href={"/account/profile"}>
            <h3 className="text-xl font-semibold text-violet-700 dark:text-white mb-2">
              Profile Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Easily edit your personal information and account settings on your
              Profile page.
            </p>
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-md shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <Link href={"/account/orders"}>
            <h3 className="text-xl font-semibold text-violet-700 dark:text-white mb-2">
              Recent Trades
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Stay on top of your latest buy/sell orders to monitor performance
              and market timing.
            </p>
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-md shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <Link href={"/account/trade"}>
            <h3 className="text-xl font-semibold text-violet-700 dark:text-white mb-2">
              Order Book
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access real-time market liquidity and make informed decisions
              quickly.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

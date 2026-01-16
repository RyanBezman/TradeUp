import { Navbar } from "@/app/Components/Home/navbar";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Features
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Everything you need to place orders and manage your account.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Order Types
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Market and limit orders with clear controls.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Orderbook
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Clean, readable depth at a glance.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Trade History
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Track fills and completed orders.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Theming
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Light and dark modes tailored for focus.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Navbar } from "@/app/Components/Home/navbar";

export default function FaqsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          FAQ&apos;s
        </h1>
        <div className="mt-8 space-y-6">
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Is TradeUp free to use?
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Yes. Optional paid plans are available for advanced needs.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Do you support light and dark mode?
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Absolutely. Toggle it from the navbar anytime.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Can I trade on mobile?
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Yes. The layout adapts to your device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

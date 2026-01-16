import { Navbar } from "@/app/Components/Home/navbar";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Pricing
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Transparent and simple. No surprises.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 p-6 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Basic
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              For getting started
            </p>
            <p className="mt-4 text-3xl font-bold text-black dark:text-white">
              $0
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Pro
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Active traders
            </p>
            <p className="mt-4 text-3xl font-bold text-black dark:text-white">
              $9/mo
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6 dark:border-zinc-800">
            <h2 className="text-2xl font-semibold text-black dark:text-white">
              Enterprise
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Teams and orgs
            </p>
            <p className="mt-4 text-3xl font-bold text-black dark:text-white">
              Contact
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

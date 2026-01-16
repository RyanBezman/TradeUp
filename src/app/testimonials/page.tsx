import { Navbar } from "@/app/Components/Home/navbar";

export default function TestimonialsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Testimonials
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          What traders say about TradeUp.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <blockquote className="rounded-xl border border-gray-200 p-5 text-gray-800 dark:border-zinc-800 dark:text-gray-200">
            “The clean UI makes placing orders effortless.”
            <footer className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              — A. Trader
            </footer>
          </blockquote>
          <blockquote className="rounded-xl border border-gray-200 p-5 text-gray-800 dark:border-zinc-800 dark:text-gray-200">
            “Dark mode is easy on the eyes.”
            <footer className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              — B. Investor
            </footer>
          </blockquote>
        </div>
      </main>
    </div>
  );
}

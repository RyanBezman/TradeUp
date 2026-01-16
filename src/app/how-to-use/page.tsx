import { Navbar } from "@/app/Components/Home/navbar";
import { ProtectedLinks } from "@/app/Components/Home/protectedLinks";

export default function HowToUsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          How to use
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Get started in seconds. You can create your own account or use a demo
          account to try the app and place trades.
        </p>
        <p className="mt-2 max-w-3xl text-sm text-gray-500 dark:text-gray-400">
          This application simulates trading behavior and is not connected to
          live markets.
        </p>
        <section className="mt-10 space-y-6">
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Option 1: Sign up
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Use the sign up flow to create your own account from the home
              page.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Option 2: Use demo accounts
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              You can log in with any of the following demo accounts:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>
                username: <span className="font-mono">a</span> / password:{" "}
                <span className="font-mono">a</span>
              </li>
              <li>
                username: <span className="font-mono">b</span> / password:{" "}
                <span className="font-mono">b</span>
              </li>
              <li>
                username: <span className="font-mono">c</span> / password:{" "}
                <span className="font-mono">c</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 p-5 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Try placing trades
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              After signing in, head to your account pages to explore balances,
              order forms, and trade history.
            </p>
            <ProtectedLinks />
          </div>
        </section>
      </main>
    </div>
  );
}

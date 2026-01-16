"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export function ProtectedLinks() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="mt-4 flex gap-3">
        <Link
          href="/account/trade"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-black hover:text-violet-600 dark:border-zinc-800 dark:text-gray-200 hover:dark:text-white"
        >
          Go to Trade
        </Link>
        <Link
          href="/account/orders"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-black hover:text-violet-600 dark:border-zinc-800 dark:text-gray-200 hover:dark:text-white"
        >
          View Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          You&apos;re not signed in. Sign in to access trading and order history.
        </p>
        <div className="mt-3 flex gap-3">
          <button
            aria-disabled
            className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-gray-400"
          >
            Go to Trade
          </button>
          <button
            aria-disabled
            className="cursor-not-allowed rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-gray-400"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}



"use client";

import { useAuth } from "@/app/context/AuthContext";

export function BitcoinBalance() {
  const { user, balance } = useAuth();

  return (
    <div className="p-2 mt-6 flex items-center gap-2 w-full">
      <img
        className="max-h-8"
        src="https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png"
      />
      <div className="flex flex-col cursor-pointer dark:text-white">
        <span>Bitcoin</span>
        <span className="text-ssm text-gray-500">{balance?.asset}</span>
      </div>
      <span className="pl-10 cursor-pointer dark:text-white"></span>
      <div className="dark:text-white">
        <span>Balance</span>
        {user && <div className="dark:text-gray-500">{balance?.balance}</div>}
      </div>
    </div>
  );
}

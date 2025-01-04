"use client";

import { Balance } from "@/app/context/AuthContext";
type BitcoinBalanceProps = {
  balance: Balance;
};
export type CoinType = "BTC" | "ETH" | "XRP" | "SOL" | "USD";
const coinPics: Record<CoinType, string> = {
  BTC: "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
  ETH: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  XRP: "https://dynamic-assets.coinbase.com/e81509d2307f706f3a6f8999968874b50b628634abf5154fc91a7e5f7685d496a33acb4cde02265ed6f54b0a08fa54912208516e956bc5f0ffd1c9c2634099ae/asset_icons/3af4b33bde3012fd29dd1366b0ad737660f24acc91750ee30a034a0679256d0b.png",
  SOL: "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/b658adaf7913c1513c8d120bcb41934a5a4bf09b6adbcb436085e2fbf6eb128c.png",
  USD: "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
};
const coinNames: Record<CoinType, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  XRP: "XRP",
  SOL: "Solana",
  USD: "USDC",
};

export function BitcoinBalance({ balance }: BitcoinBalanceProps) {
  const asset = balance?.asset;
  const displayPic = coinPics[asset as CoinType];
  const displayName = coinNames[asset as CoinType];
  return (
    <div className="px-4 py-2 flex items-center justify-between w-full">
      <div className="flex gap-2 cursor-pointer dark:text-white">
        <img className="max-h-8" src={displayPic} />
        <div className="flex flex-col">
          <span className="font-semibold">{displayName}</span>
          <span className="text-ssm text-gray-500">{balance?.asset}</span>
        </div>
      </div>
      <div className="dark:text-white flex flex-col">
        <span className="font-semibold text-end">Balance</span>
        <div className="dark:text-gray-500 text-end">
          {parseFloat(balance?.balance).toFixed(4)}
        </div>
      </div>
    </div>
  );
}

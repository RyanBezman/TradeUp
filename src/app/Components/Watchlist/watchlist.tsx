"use client";
import { ChangeEvent, useState } from "react";
import { ColumnHeader } from "../Orderbook/columnHeader";
import { SearchInput } from "./searchInput";
import { CoinType } from "../Account/coinBalance";
const books = [
  "BTC-ETH",
  "BTC-XRP",
  "BTC-SOL",
  "BTC-USD",
  "ETH-BTC",
  "ETH-XRP",
  "ETH-SOL",
  "ETH-USD",
  "XRP-BTC",
  "XRP-ETH",
  "XRP-SOL",
  "XRP-USD",
  "SOL-BTC",
  "SOL-ETH",
  "SOL-XRP",
  "SOL-USD",
  "USD-BTC",
  "USD-ETH",
  "USD-XRP",
  "USD-SOL",
];
const coinPics: Record<CoinType, string> = {
  BTC: "https://dynamic-assets.coinbase.com/e785e0181f1a23a30d9476038d9be91e9f6c63959b538eabbc51a1abc8898940383291eede695c3b8dfaa1829a9b57f5a2d0a16b0523580346c6b8fab67af14b/asset_icons/b57ac673f06a4b0338a596817eb0a50ce16e2059f327dc117744449a47915cb2.png",
  ETH: "https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png",
  XRP: "https://dynamic-assets.coinbase.com/e81509d2307f706f3a6f8999968874b50b628634abf5154fc91a7e5f7685d496a33acb4cde02265ed6f54b0a08fa54912208516e956bc5f0ffd1c9c2634099ae/asset_icons/3af4b33bde3012fd29dd1366b0ad737660f24acc91750ee30a034a0679256d0b.png",
  SOL: "https://asset-metadata-service-production.s3.amazonaws.com/asset_icons/b658adaf7913c1513c8d120bcb41934a5a4bf09b6adbcb436085e2fbf6eb128c.png",
  USD: "https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png",
};
type WatchlistProps = {
  setSelectedBaseAsset: (params: string) => void;
  setSelectedQuoteAsset: (params: string) => void;
};
export function Watchlist({
  setSelectedBaseAsset,
  setSelectedQuoteAsset,
}: WatchlistProps) {
  const [searchValue, setSearchValue] = useState("");
  const [orderBooks, setOrderBooks] = useState(books);
  const [activeBook, setActiveBook] = useState("BTC-USD");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const booksToDisplay = books.filter((book) =>
      book.toLocaleLowerCase().includes(value)
    );
    setOrderBooks(booksToDisplay);
  };
  return (
    <div className="hidden min-[505px]:flex flex-col max-w-[224px] min-w-[177px] border border-l-0 border-t-0 dark:border-gray-600">
      <ColumnHeader title="Watchlist" />
      <SearchInput
        searchValue={searchValue}
        handleInputChange={handleInputChange}
      />
      <div className="bg-violet-500 dark:bg-zinc-700 text-white font-bold flex gap-12 py-1 px-6">
        <label className="w-1/5 text-end text-nowrap">
          {books.length} Markets
        </label>
      </div>
      <ul className="flex flex-col flex-1 overflow-auto no-scrollbar">
        {orderBooks.map((book) => {
          const coinOne = book.slice(0, 3);
          const coinTwo = book.slice(4, 7);

          return (
            <li
              key={book}
              className={`dark:text-gray-400 transition-all text-black hover:dark:text-white hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-zinc-900 font-semibold flex justify-between py-5 px-8 cursor-pointer  ${
                activeBook === book &&
                "bg-violet-100 text-violet-600 dark:bg-zinc-900 dark:text-white"
              } flex items-center`}
              onClick={() => {
                setActiveBook(book);
                setSelectedBaseAsset(coinOne);
                setSelectedQuoteAsset(coinTwo);
              }}
            >
              <div className="relative w-fit flex">
                <img
                  className="w-6 h-6 z-10"
                  src={coinPics[coinOne as CoinType]}
                  alt={coinOne}
                />
                <img
                  className="w-6 h-6 absolute left-4"
                  src={coinPics[coinTwo as CoinType]}
                  alt={coinOne}
                />
              </div>
              <div>{book}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

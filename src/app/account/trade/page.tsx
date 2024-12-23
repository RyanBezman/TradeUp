"use client";
import Account from "../page";
import { OrderBook, OrderData } from "@/app/Components/Orderbook/orderbook";
import StaticInput from "@/app/Components/Orderbook/staticInput";
import { useEffect, useRef, useState } from "react";
import { ColumnHeader } from "@/app/Components/Orderbook/columnHeader";
import {
  BitcoinBalance,
  CoinType,
} from "@/app/Components/Account/bitcoinBalance";
import { useAuth } from "@/app/context/AuthContext";
import { getBalances } from "@/actions/balance/getBalances";
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

export default function Trade() {
  return (
    <Account>
      <TradeLayout />
    </Account>
  );
}

export function TradeLayout() {
  const { balances, user } = useAuth();

  const [isSelected, setIsSelected] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const [whenPriceIs, setWhenPriceIs] = useState("");
  const [buyError, setBuyError] = useState<string | null>(null);
  const [sellError, setSellError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedQuoteAsset, setSelectedQuoteAsset] = useState("USD");
  const [isQuoteAssetDropdownOpen, setIsQuoteAssetDropdownOpen] =
    useState(false);
  const [displayedBalances, setDisplayedBalances] = useState(balances);

  const displayPic = coinPics[selectedCoin as CoinType];
  const displayName = coinNames[selectedCoin as CoinType];
  const quoteAssetDiplayPic = coinPics[selectedQuoteAsset as CoinType];
  const quoteAssetDisplayName = coinNames[selectedQuoteAsset as CoinType];
  const socketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => console.log("ws open");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "order_book") {
        setAsks(data.asks);
        setBids(data.bids);
      }
    };

    socketRef.current = ws;

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const placeSell = async () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const numericPrice = Number(whenPriceIs.replace(/,/g, "")).toString();
    const numericSize = Number(amount.replace(/,/g, "")).toString();
    if (!user) {
      return;
    }
    const orderData = {
      type: "new_order",
      id: user.id,
      side: isSelected,
      orderType,
      baseAsset: selectedCoin,
      quoteAsset: selectedQuoteAsset,
      price: numericPrice,
      amount: numericSize,
      filledAmount: "0",
      status: "pending",
    };

    try {
      socket.send(JSON.stringify(orderData));
    } catch (error) {
      console.error("Failed to send order:", error);
    }
    setAmount("");
    setWhenPriceIs("");
  };
  const placeBuy = async () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const numericPrice = Number(whenPriceIs.replace(/,/g, "")).toString();
    const numericSize = Number(amount.replace(/,/g, "")).toString();
    if (!user) {
      return;
    }
    const orderData = {
      type: "new_order",
      id: user.id,
      side: isSelected,
      orderType,
      baseAsset: selectedCoin,
      quoteAsset: selectedQuoteAsset,
      price: numericPrice,
      amount: numericSize,
      filledAmount: "0",
      status: "pending",
    };
    try {
      socket.send(JSON.stringify(orderData));
    } catch (error) {
      console.error("Failed to send order:", error);
    }
    setAmount("");
    setWhenPriceIs("");
  };

  const handleBuyButtonClick = () => {
    setIsSelected("buy");
    setOrderType("market");
    setAmount("");
    setWhenPriceIs("");
    setSellError(null);
    setBuyError(null);
  };
  const handleSellButtonClick = () => {
    setIsSelected("sell");
    setOrderType("market");
    setAmount("");
    setWhenPriceIs("");
    setSellError(null);
    setBuyError(null);
  };
  const handleInputNumber = (value: number | string): string => {
    if (!value) return "";

    const stringVal = value.toString().replace(/,/g, "");
    const numberValue = +stringVal;

    if (isNaN(numberValue)) return "";

    return numberValue.toLocaleString("en-US");
  };
  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col h-full">
      <div className="max-h-full h-full flex flex-row justify-between">
        <div className="border dark:border-gray-600  border-t-0 border-l-0 flex min-w-[320px] w-1/4 flex-col gap-4 ">
          <ColumnHeader title="Order Form" />
          <div className="p-4 flex flex-col gap-8">
            <div className="flex w-full gap-2">
              <button
                onClick={handleBuyButtonClick}
                className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all ${
                  isSelected === "buy"
                    ? "bg-violet-800 dark:bg-green-700 text-white shadow-md"
                    : "bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-zinc-600"
                }`}
              >
                Buy
              </button>
              <button
                onClick={handleSellButtonClick}
                className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all ${
                  isSelected === "sell"
                    ? "bg-violet-800 dark:bg-green-700 text-white shadow-md"
                    : "bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-zinc-600"
                }`}
              >
                Sell
              </button>
            </div>

            <div className="flex w-full justify-center gap-4">
              <span
                onClick={() => {
                  setOrderType("market");
                  setAmount("");
                  setWhenPriceIs("");
                }}
                className={`cursor-pointer text-2xl ${
                  orderType === "market"
                    ? "border-b-2 text-black border-black dark:text-white dark:border-white font-semibold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Market
              </span>
              <span
                onClick={() => {
                  setOrderType("limit");
                  setAmount("");
                }}
                className={`cursor-pointer text-2xl ${
                  orderType === "limit"
                    ? "border-b-2 text-black border-black dark:text-white dark:border-white font-semibold "
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Limit
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold dark:text-white text-black">
                Amount
              </span>
              <StaticInput
                amount={amount}
                selectedCoin={selectedCoin}
                setAmount={setAmount}
                setSellError={setSellError}
                setBuyError={setBuyError}
              />
              {orderType === "limit" && (
                <span className="ml-2 text-xs">
                  USD =
                  {amount &&
                  whenPriceIs &&
                  orderType === "limit" &&
                  amount.length > 1
                    ? " $" +
                      (
                        Number(amount.replace(/,/g, "")) *
                        Number(whenPriceIs.replace(/,/g, ""))
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : ""}
                </span>
              )}
              {orderType === "limit" && (
                <div className="flex flex-col gap-2 ">
                  <span className="font-semibold dark:text-white text-black">
                    When price reaches
                  </span>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="bg-transparent text-black dark:text-white outline-none text-xl border rounded-md p-2"
                      value={whenPriceIs}
                      placeholder="0"
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, "");
                        if (value.length > 9) {
                          return;
                        }
                        const newValue = handleInputNumber(value);
                        setWhenPriceIs(newValue);
                      }}
                    />
                    <span className="dark:text-white text-gray-400 ml-2 text-xl">
                      USD
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-semibold dark:text-white text-black">
                  Asset
                </span>
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-full p-3 border rounded-md   dark:text-white"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={displayPic}
                        alt={selectedCoin}
                        className="w-6 h-6"
                      />
                      <span>{displayName}</span>
                    </div>
                    <span className=" dark:text-gray-400">&gt;</span>
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute z-10 mt-2 w-full dark:bg-black bg-white dark:border rounded-md shadow-md">
                      {Object.keys(coinPics).map((coin) => {
                        const displayPic = coinPics[coin as CoinType];
                        const displayName = coinNames[coin as CoinType];
                        return (
                          <li
                            key={coin}
                            className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedCoin(coin);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <img
                              src={displayPic}
                              alt={coin}
                              className="w-6 h-6"
                            />
                            <span className="dark:text-white">
                              {displayName}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <span className="font-semibold dark:text-white text-black">
                  {isSelected === "buy" ? "Purchase with" : "Sell for"}
                </span>
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-full p-3 border rounded-md   dark:text-white"
                    onClick={() =>
                      setIsQuoteAssetDropdownOpen(!isQuoteAssetDropdownOpen)
                    }
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={quoteAssetDiplayPic}
                        alt={selectedQuoteAsset}
                        className="w-6 h-6"
                      />
                      <span>{quoteAssetDisplayName}</span>
                    </div>
                    <span className=" dark:text-gray-400">&gt;</span>
                  </button>
                  {isQuoteAssetDropdownOpen && (
                    <ul className="absolute z-10 mt-2 w-full dark:bg-black bg-white dark:border rounded-md shadow-md">
                      {Object.keys(coinPics).map((coin) => {
                        const displayPic = coinPics[coin as CoinType];
                        const displayName = coinNames[coin as CoinType];
                        return (
                          <li
                            key={coin}
                            className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedQuoteAsset(coin);
                              setIsQuoteAssetDropdownOpen(false);
                            }}
                          >
                            <img
                              src={displayPic}
                              alt={coin}
                              className="w-6 h-6"
                            />
                            <span className="dark:text-white">
                              {displayName}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              <span className="text-red-500 text-sm">
                {orderType === "market" && isSelected === "buy" && buyError}
                {orderType === "market" && isSelected === "sell" && sellError}
              </span>
            </div>

            <button
              onClick={() => {
                if (isSelected === "sell") {
                  if (!bids.length && orderType === "market") {
                    setSellError("There are no current bids available.");
                    return;
                  }
                  placeSell();
                } else if (isSelected === "buy") {
                  if (!asks.length && orderType === "market") {
                    setBuyError("There are no current asks available.");
                    return;
                  }
                  placeBuy();
                  setAmount("");
                }
              }}
              className="py-3 px-6 rounded-full font-semibold w-full transition-all bg-violet-800 dark:bg-green-700 text-white hover:bg-violet-700"
            >
              Place {isSelected === "buy" ? "Buy" : "Sell"} Order
            </button>
            <div>
              {displayedBalances?.map(
                (balance: { asset: string; balance: string }) => (
                  <BitcoinBalance key={balance.asset} balance={balance} />
                )
              )}
            </div>
          </div>
        </div>
        <OrderBook asks={asks} bids={bids} />
      </div>
    </div>
  );
}

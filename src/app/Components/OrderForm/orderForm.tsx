import { RefObject, useState } from "react";
import { ColumnHeader } from "../Orderbook/columnHeader";
import StaticInput from "../Orderbook/staticInput";
import { OrderData } from "../Orderbook/orderbook";
import { CoinBalance, CoinType } from "../Account/coinBalance";
import { Balance, useAuth } from "@/app/context/AuthContext";
import { CoinOption } from "./coinOption";
import { BuyButton } from "./buyButton";
import { SellButton } from "./sellButton";
import { OrderTypeButton } from "./orderTypeButton";
type OrderFormProps = {
  asks: OrderData[];
  bids: OrderData[];
  selectedBaseAsset: string;
  selectedQuoteAsset: string;
  setSelectedQuoteAsset: (param: string) => void;
  setSelectedBaseAsset: (param: string) => void;
  displayedBalances: Balance[] | null;
  socketRef: RefObject<WebSocket | null>;
};
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
const handleInputNumber = (value: number | string): string => {
  if (!value) return "";

  const stringVal = value.toString().replace(/,/g, "");
  const numberValue = +stringVal;

  if (isNaN(numberValue)) return "";

  return numberValue.toLocaleString("en-US");
};
export function OrderForm({
  asks,
  bids,
  selectedBaseAsset,
  selectedQuoteAsset,
  setSelectedQuoteAsset,
  setSelectedBaseAsset,
  displayedBalances,
  socketRef,
}: OrderFormProps) {
  const { balances, user } = useAuth();
  const [buyError, setBuyError] = useState<string | null>(null);
  const [sellError, setSellError] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [whenPriceIs, setWhenPriceIs] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuoteAssetDropdownOpen, setIsQuoteAssetDropdownOpen] =
    useState(false);
  const displayPic = coinPics[selectedBaseAsset as CoinType];
  const displayName = coinNames[selectedBaseAsset as CoinType];
  const quoteAssetDiplayPic = coinPics[selectedQuoteAsset as CoinType];
  const quoteAssetDisplayName = coinNames[selectedQuoteAsset as CoinType];

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
  const handleMarketToggle = () => {
    setOrderType("market");
    setAmount("");
    setWhenPriceIs("");
  };
  const handleLimitToggle = () => {
    setOrderType("limit");
    setAmount("");
  };
  const placeBuy = async () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const numericPrice = Number(whenPriceIs.replace(/,/g, "")).toString();
    const numericSize = Number(amount.replace(/,/g, "")).toString();
    if (!user || !balances || !displayedBalances) {
      return;
    }

    const book = `${selectedBaseAsset}-${selectedQuoteAsset}`;
    const orderData = {
      type: "new_order",
      id: user.id,
      side: isSelected,
      orderType,
      baseAsset: selectedBaseAsset,
      quoteAsset: selectedQuoteAsset,
      price: numericPrice,
      amount: numericSize,
      orderBook: book,
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
  const placeSell = async () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const numericPrice = Number(whenPriceIs.replace(/,/g, "")).toString();
    const numericSize = Number(amount.replace(/,/g, "")).toString();
    if (!user || !balances || !displayedBalances) {
      return;
    }
    if (orderType === "limit" && +numericPrice <= 0) {
      setSellError("Please enter a limit price.");
      return;
    }
    for (const balance of displayedBalances) {
      if (balance.asset === selectedBaseAsset) {
        const scaleFactor = 10 ** 8;
        const scaledSize = Math.round(+numericSize * scaleFactor);
        const scaledBalance = Math.round(+balance.balance * scaleFactor);
        console.log(scaledSize, scaledBalance);
        if (scaledSize > scaledBalance) {
          setSellError("Insufficient Balance: Please try again.");
          setTimeout(() => {
            setSellError("");
          }, 10000);
          return;
        }
      }
    }
    if (orderType === "market" && bids.length === 0) {
      setSellError("There are no current bids available.");
      return;
    }
    const book = `${selectedBaseAsset}-${selectedQuoteAsset}`;
    const orderData = {
      type: "new_order",
      id: user.id,
      side: isSelected,
      orderType,
      baseAsset: selectedBaseAsset,
      quoteAsset: selectedQuoteAsset,
      price: numericPrice,
      amount: numericSize,
      orderBook: book,
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
    setSellError("");
  };
  return (
    <div className="border dark:border-gray-600  border-t-0 border-l-0 flex min-w-[320px] w-1/4 flex-col gap-4">
      <ColumnHeader title="Order Form" />
      <div className="p-4 flex flex-col gap-8">
        <div className="flex w-full gap-2">
          <BuyButton
            handleBuyButtonClick={handleBuyButtonClick}
            isSelected={isSelected}
          />
          <SellButton
            handleSellButtonClick={handleSellButtonClick}
            isSelected={isSelected}
          />
        </div>
        <div className="flex w-full justify-center gap-4">
          <OrderTypeButton
            toggleOrderType={handleMarketToggle}
            orderType={orderType}
            type="market"
          />
          <OrderTypeButton
            toggleOrderType={handleLimitToggle}
            orderType={orderType}
            type="limit"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-semibold dark:text-white text-black">
            Amount
          </span>
          <StaticInput
            amount={amount}
            selectedCoin={selectedBaseAsset}
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
                Limit Price
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
                  {selectedQuoteAsset}
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
                onClick={() => {
                  setIsQuoteAssetDropdownOpen(false);
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={displayPic}
                    alt={selectedBaseAsset}
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
                      <CoinOption
                        key={coin}
                        coin={coin}
                        closeDropdown={setIsDropdownOpen}
                        setAsset={setSelectedBaseAsset}
                        displayPic={displayPic}
                        displayName={displayName}
                      />
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
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsQuoteAssetDropdownOpen(!isQuoteAssetDropdownOpen);
                }}
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
                <ul className="absolute z-10 mt-2 w-full dark:bg-black bg-white dark:border overflow-y-auto rounded-md shadow-md">
                  {Object.keys(coinPics).map((coin) => {
                    const displayPic = coinPics[coin as CoinType];
                    const displayName = coinNames[coin as CoinType];
                    return (
                      <CoinOption
                        key={coin}
                        coin={coin}
                        closeDropdown={setIsQuoteAssetDropdownOpen}
                        setAsset={setSelectedQuoteAsset}
                        displayPic={displayPic}
                        displayName={displayName}
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <span className="text-red-500 text-sm">
            {isSelected === "buy" && buyError}
            {isSelected === "sell" && sellError}
          </span>
        </div>

        <button
          onClick={() => {
            if (isSelected === "sell") {
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
              <CoinBalance key={balance.asset} balance={balance} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

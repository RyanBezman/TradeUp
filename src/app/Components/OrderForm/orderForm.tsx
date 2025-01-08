import { RefObject, useState } from "react";
import { ColumnHeader } from "../Orderbook/columnHeader";
import StaticInput from "../Orderbook/staticInput";
import { OrderData } from "../Orderbook/orderbook";
import { CoinBalance } from "../Account/coinBalance";
import { Balance, useAuth } from "@/app/context/AuthContext";
import { OrderTypeToggles } from "./orderTypeToggles";
import { PlaceOrderButton } from "./placeOrderButton";
type OrderFormProps = {
  asks: OrderData[];
  bids: OrderData[];
  selectedBaseAsset: string;
  selectedQuoteAsset: string;
  displayedBalances: Balance[] | null;
  socketRef: RefObject<WebSocket | null>;
};

const handleInputNumber = (value: number | string): string => {
  if (!value) return "";

  const stringVal = value.toString().replace(/,/g, "");
  const numberValue = +stringVal;

  if (isNaN(numberValue)) return "";

  return numberValue.toLocaleString("en-US");
};
export function preciseMultiplication(value1: string, value2: string): string {
  const scaleNumber = Math.pow(10, 8);
  const answer =
    (Math.round(parseFloat(value1) * scaleNumber) *
      Math.round(parseFloat(value2) * scaleNumber)) /
    Math.pow(scaleNumber, 2);

  return answer.toString();
}
export function OrderForm({
  asks,
  bids,
  selectedBaseAsset,
  selectedQuoteAsset,
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
    setSellError(null);
  };
  const handlePlaceOrder = () => {
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
  };

  return (
    <div className="border dark:border-gray-600 border-t-0 border-l-0 flex min-w-[320px] w-1/4 flex-col gap-4">
      <ColumnHeader title="Order Form" />
      <div className="p-4 flex flex-col gap-4">
        <OrderTypeToggles
          handleBuyButtonClick={handleBuyButtonClick}
          handleLimitToggle={handleLimitToggle}
          handleMarketToggle={handleMarketToggle}
          handleSellButtonClick={handleSellButtonClick}
          isSelected={isSelected}
          orderType={orderType}
        />
        <div className="flex flex-col gap-6">
          <StaticInput
            isSelected={isSelected}
            buyError={buyError}
            sellError={sellError}
            amount={amount}
            selectedCoin={selectedBaseAsset}
            selectedQuoteAsset={selectedQuoteAsset}
            whenPriceIs={whenPriceIs}
            setAmount={setAmount}
            setSellError={setSellError}
            setBuyError={setBuyError}
            displayedBalances={displayedBalances}
            label="Amount"
          />
          {orderType === "limit" && (
            <div className="flex flex-col gap-1 ">
              <span className="font-semibold dark:text-white text-black">
                Limit Price
              </span>
              <div className="flex items-center">
                <input
                  type="text"
                  className="bg-transparent text-black dark:text-white outline-none text-xl border rounded-md p-2  focus:ring-2 focus:ring-violet-800"
                  value={whenPriceIs}
                  placeholder="0"
                  onChange={(e) => {
                    setBuyError(null);
                    const value = e.target.value.replace(/,/g, "");
                    if (isSelected === "buy" && displayedBalances) {
                      const amountToOrder = preciseMultiplication(
                        value,
                        amount
                      );
                      for (const balance of displayedBalances) {
                        if (balance.asset === selectedQuoteAsset) {
                          if (+balance.balance < +amountToOrder) {
                            setBuyError(
                              "Insufficient funds, please try again."
                            );
                          }
                        }
                      }
                    }
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
        </div>
        <PlaceOrderButton
          handlePlaceOrder={handlePlaceOrder}
          isSelected={isSelected}
          buyError={buyError}
          sellError={sellError}
        />
        <div className="flex flex-col gap-4 overflow-auto">
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

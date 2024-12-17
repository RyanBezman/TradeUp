"use client";
import Account from "../page";
import { OrderBook, OrderData } from "@/app/Components/Orderbook/orderbook";
import StaticInput from "@/app/Components/Orderbook/staticInput";
import { useEffect, useRef, useState } from "react";
import { ColumnHeader } from "@/app/Components/Orderbook/columnHeader";
import { BitcoinBalance } from "@/app/Components/Account/bitcoinBalance";

export default function Trade() {
  return (
    <Account>
      <TradeLayout />
    </Account>
  );
}

export function TradeLayout() {
  const [isSelected, setIsSelected] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [amount, setAmount] = useState("");
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const [whenPriceIs, setWhenPriceIs] = useState("");
  const [buyError, setBuyError] = useState<string | null>(null);
  const [sellError, setSellError] = useState<string | null>(null);

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

  const placeSell = () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const numericPrice = Number(whenPriceIs.replace(/,/g, ""));
    const numericSize = Number(amount.replace(/,/g, ""));
    const orderData = {
      type: "new_order",
      side: isSelected,
      orderType,
      price: numericPrice,
      size: numericSize,
      formattedSize: numericSize.toFixed(4),
    };

    socket.send(JSON.stringify(orderData));
    setAmount("");
    setWhenPriceIs("");
  };

  const placeBuy = () => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const numericPrice = Number(whenPriceIs.replace(/,/g, ""));
    const numericSize = Number(amount.replace(/,/g, ""));

    const orderData = {
      type: "new_order",
      side: isSelected,
      orderType,
      size: numericSize,
      price: numericPrice,
      formattedSize: numericSize.toFixed(4),
    };

    socket.send(JSON.stringify(orderData));
    setAmount("");
    setWhenPriceIs("");
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
      <div className="max-h-full h-full flex justify-between">
        <div className="border dark:border-gray-600  border-t-0 border-l-0 flex min-w-[320px] w-1/4 flex-col gap-4 ">
          <ColumnHeader title="Order Form" />
          <div className="p-4 flex flex-col gap-16">
            <div className="flex w-full gap-2">
              <button
                onClick={() => {
                  setIsSelected("buy");
                  setOrderType("market");
                  setAmount("");
                  setWhenPriceIs("");
                  setSellError(null);
                  setBuyError(null);
                }}
                className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all ${
                  isSelected === "buy"
                    ? "bg-violet-800 dark:bg-green-700 text-white shadow-md"
                    : "bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-zinc-600"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => {
                  setIsSelected("sell");
                  setOrderType("market");
                  setAmount("");
                  setWhenPriceIs("");
                  setSellError(null);
                  setBuyError(null);
                }}
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
                setAmount={setAmount}
                setSellError={setSellError}
                setBuyError={setBuyError}
              />
              <span className="text-red-500 text-sm">
                {orderType === "market" && isSelected === "buy" && buyError}
                {orderType === "market" && isSelected === "sell" && sellError}
              </span>
              {orderType === "limit" && (
                <span className="ml-2">
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
            </div>
            {orderType === "limit" && (
              <div className="flex flex-col gap-2">
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
            <BitcoinBalance />
          </div>
        </div>
        <OrderBook asks={asks} bids={bids} />
      </div>
    </div>
  );
}

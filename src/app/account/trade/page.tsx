"use client";
import Account from "../page";
import { OrderBook } from "@/app/Components/Orderbook/orderbook";
import StaticInput from "@/app/Components/Orderbook/staticInput";
import { useState } from "react";
import { ColumnHeader } from "@/app/Components/Orderbook/columnHeader";

export default function Trade() {
  return (
    <Account>
      <TradeLayout />
    </Account>
  );
}

export function TradeLayout() {
  const [isSelected, setIsSelected] = useState("buy");
  const [purchaseType, setPurchaseType] = useState("market");
  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col h-full">
      <div className="max-h-full h-full flex justify-between">
        <div className="border flex flex-col gap-4 ">
          <ColumnHeader title="Order Form" />
          <div className="p-4 flex flex-col gap-16">
            <div className="flex w-full gap-2">
              <button
                onClick={() => setIsSelected("buy")}
                className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all ${
                  isSelected === "buy"
                    ? "bg-violet-800 dark:bg-green-700 text-white shadow-md"
                    : "bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-zinc-600"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setIsSelected("sell")}
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
                onClick={() => setPurchaseType("market")}
                className={`cursor-pointer text-2xl ${
                  purchaseType === "market"
                    ? "border-b-2 text-black border-black dark:text-white dark:border-white font-semibold"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Market
              </span>
              <span
                onClick={() => setPurchaseType("limit")}
                className={`cursor-pointer text-2xl ${
                  purchaseType === "limit"
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
              <StaticInput />
            </div>
            {purchaseType === "limit" && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold dark:text-white text-black">
                  When price reaches
                </span>
                <StaticInput />
              </div>
            )}

            <button className="py-3 px-6 rounded-full font-semibold w-full transition-all bg-violet-800 dark:bg-green-700 text-white hover:bg-violet-700">
              Place {isSelected === "buy" ? "Buy" : "Sell"} Order
            </button>
          </div>
        </div>
        <OrderBook />
      </div>
    </div>
  );
}

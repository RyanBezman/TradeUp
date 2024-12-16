"use client";

import { useRef } from "react";
import { ColumnHeader } from "./columnHeader";
import { LabelHeader } from "./labelheader";
import { Divider } from "./divider";
import { Cell } from "./cell";

export type OrderData = {
  size: number;
  price: string;
  formattedSize: number;
};

type OrderBookProps = {
  asks: OrderData[];
  bids: OrderData[];
};

export function OrderBook({ asks, bids }: OrderBookProps) {
  const asksContainerRef = useRef<HTMLDivElement | null>(null);
  const bidsContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex w-full flex-col max-w-md border border-r-0 border-t-0 dark:border-gray-300 ">
      <ColumnHeader title="Order Book" />
      <LabelHeader left="Amount (BTC)" right="MySize" />
      <div className="flex flex-col flex-grow overflow-hidden">
        <OrderBookAsks bids={asks} bidsContainerRef={bidsContainerRef} />
        <Divider />
        <OrderBookBids asks={bids} asksContainerRef={asksContainerRef} />
      </div>
    </div>
  );
}

type OrderBookSellsProps = {
  asks: OrderData[];
  asksContainerRef: React.RefObject<HTMLDivElement>;
};
function OrderBookBids({ asks, asksContainerRef }: OrderBookSellsProps) {
  return (
    <div
      className="flex-grow overflow-y-auto no-scrollbar"
      ref={asksContainerRef}
    >
      {asks.map((ask: OrderData) => {
        const { size, price, formattedSize } = ask;
        const randomNum = Math.random() * 10000000;
        console.log(size, price);
        return (
          <Cell
            key={`sell-${size + price + randomNum}`}
            size={formattedSize}
            price={price}
            type="sell"
          />
        );
      })}
    </div>
  );
}

type OrderBookBidsProps = {
  bids: OrderData[];
  bidsContainerRef: React.RefObject<HTMLDivElement>;
};
function OrderBookAsks({ bids, bidsContainerRef }: OrderBookBidsProps) {
  return (
    <div
      className="flex-grow overflow-y-auto no-scrollbar rotate-180 "
      ref={bidsContainerRef}
    >
      {bids.map((bid: OrderData) => {
        const { size, price, formattedSize } = bid;
        console.log(size, price);
        const getRandomNum = Math.random() * 10000000;
        return (
          <Cell
            key={`bid-${size + price + getRandomNum}`}
            size={formattedSize}
            price={price}
            type="bid"
          />
        );
      })}
    </div>
  );
}

// function getRandomNumber(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function addSells() {
//   const size = (0.1 * Math.random()).toFixed(4);
//   const price = getRandomNumber(92000, 100000);

//   return { size, price };
// }

"use client";

import { useRef } from "react";
import { ColumnHeader } from "./columnHeader";
import { LabelHeader } from "./labelheader";
import { Divider } from "./divider";
import { Cell } from "./cell";

export type OrderData = {
  amount: string;
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
    <div className="flex flex-col w-1/4 min-w-[320px] border border-r-0 border-t-0 dark:border-gray-600 ">
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
        const { price, amount } = ask;

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
        const { price, amount } = bid;
        const size = parseFloat(amount).toFixed(4);
        console.log(bid);
        const getRandomNum = Math.random() * 10000000;
        return (
          <Cell
            key={`bid-${size + price + getRandomNum}`}
            size={amount}
            price={price}
            type="bid"
          />
        );
      })}
    </div>
  );
}

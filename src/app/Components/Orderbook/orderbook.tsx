"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnHeader } from "./columnHeader";
import { LabelHeader } from "./labelheader";
import { Divider } from "./divider";
import { Cell } from "./cell";

type OrderData = {
  size: number;
  price: number;
};

export function OrderBook() {
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const asksContainerRef = useRef<HTMLDivElement | null>(null);
  const bidsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = addSells();
      const bidsData = addSells();

      setAsks((prev) => {
        const newAsks = [data, ...prev];
        if (asksContainerRef.current) {
          asksContainerRef.current.scrollTop = 0;
        }
        return newAsks.slice(0, 100);
      });
      setBids((prev) => {
        const newBids = [bidsData, ...prev];
        if (bidsContainerRef.current) {
          bidsContainerRef.current.scrollTop = 0;
        }
        return newBids.slice(0, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {}, [asks, bids]);
  return (
    <div className="flex w-full flex-col max-w-md border border-r-0 border-t-0 dark:border-gray-300 ">
      <ColumnHeader title="Order Book" />
      <LabelHeader left="Market Size" right="MySize" />
      <div className="flex flex-col flex-grow overflow-hidden">
        <OrderBookBids bids={bids} bidsContainerRef={bidsContainerRef} />
        <Divider />
        <OrderBookSells asks={asks} asksContainerRef={asksContainerRef} />
      </div>
    </div>
  );
}

type OrderBookSellsProps = {
  asks: OrderData[];
  asksContainerRef: React.RefObject<HTMLDivElement>;
};
function OrderBookSells({ asks, asksContainerRef }: OrderBookSellsProps) {
  return (
    <div
      className="flex-grow overflow-y-auto no-scrollbar"
      ref={asksContainerRef}
    >
      {asks.map((ask: OrderData, index: number) => {
        const { size, price } = ask;
        return (
          <Cell
            key={`sell-${index}`}
            size={size.toFixed(4).toString()}
            price={price.toString()}
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
function OrderBookBids({ bids, bidsContainerRef }: OrderBookBidsProps) {
  return (
    <div
      className="flex-grow overflow-y-auto no-scrollbar rotate-180 "
      ref={bidsContainerRef}
    >
      {bids.map((bid: OrderData, index: number) => {
        const { size, price } = bid;
        return (
          <Cell
            key={`bid-${index}`}
            size={size.toFixed(4).toString()}
            price={price.toString()}
            type="bid"
          />
        );
      })}
    </div>
  );
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addSells() {
  const size = 0.1 * Math.random();
  const price = getRandomNumber(92000, 100000);

  return { size, price };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnHeader } from "./columnHeader";
import { LabelHeader } from "./labelheader";
import { Divider } from "./divider";
import { Cell } from "./cell";

export type OrderData = {
  size: number;
  price: string;
};

type OrderBookProps = {
  asks: OrderData[];
  bids: OrderData[];
};

export function OrderBook({ asks, bids }: OrderBookProps) {
  const asksContainerRef = useRef<HTMLDivElement | null>(null);
  const bidsContainerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const socket = new WebSocket("ws://localhost:8080");

  //   socket.onmessage = (event) => {
  //     const { ask, bid } = JSON.parse(event.data);

  //     setAsks((prev) => {
  //       const newAsks = [ask, ...prev];
  //       if (asksContainerRef.current) {
  //         asksContainerRef.current.scrollTop = 0;
  //       }
  //       return newAsks.slice(0, 100);
  //     });

  //     setBids((prev) => {
  //       const newBids = [bid, ...prev];
  //       if (bidsContainerRef.current) {
  //         bidsContainerRef.current.scrollTop = 0;
  //       }
  //       return newBids.slice(0, 100);
  //     });
  //   };
  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  return (
    <div className="flex w-full flex-col max-w-md border border-r-0 border-t-0 dark:border-gray-300 ">
      <ColumnHeader title="Order Book" />
      <LabelHeader left="Market Size" right="MySize" />
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
        const { size, price } = ask;
        const randomNum = Math.random() * 10000000;
        console.log(size, price);
        return (
          <Cell
            key={`sell-${size + price + randomNum}`}
            size={size}
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
        const { size, price } = bid;
        console.log(size, price);
        const getRandomNum = Math.random() * 10000000;
        return (
          <Cell
            key={`bid-${size + price + getRandomNum}`}
            size={size}
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

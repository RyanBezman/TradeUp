"use client";

import { useRef } from "react";
import { ColumnHeader } from "./columnHeader";
import { LabelHeader } from "./labelheader";
import { Divider } from "./divider";
import { Cell } from "./cell";

export type OrderData = {
  amount: string;
  price: string;
  filledAmount: string;
  orderBook: string;
};

type OrderBookProps = {
  asks: OrderData[];
  bids: OrderData[];
  selectedBaseAsset: string;
  selectedQuoteAsset: string;
  isHeaderDisplayed: boolean;
};

export function OrderBook({
  asks,
  bids,
  selectedBaseAsset,
  selectedQuoteAsset,
  isHeaderDisplayed,
}: OrderBookProps) {
  const asksContainerRef = useRef<HTMLDivElement | null>(null);
  const bidsContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className=" flex flex-col flex-1 border border-l-0 border-t-0 dark:border-gray-600 ">
      {isHeaderDisplayed && (
        <ColumnHeader
          title="Order Book"
          book={`${selectedBaseAsset} - ${selectedQuoteAsset}`}
        />
      )}
      <LabelHeader
        left={`Amount (${selectedBaseAsset})`}
        right={`Price (${selectedQuoteAsset})`}
        colThree="MySize"
      />
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
export function OrderBookBids({ asks, asksContainerRef }: OrderBookSellsProps) {
  return (
    <div
      className="flex-grow overflow-y-auto no-scrollbar"
      ref={asksContainerRef}
    >
      {asks.map((ask: OrderData) => {
        const { price, amount, filledAmount } = ask;
        const size = (+amount - +filledAmount).toFixed(4);
        const randomNum = Math.random() * 10000000;
        console.log(amount, price);
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
export function OrderBookAsks({ bids, bidsContainerRef }: OrderBookBidsProps) {
  return (
    <div
      className="flex-grow overflow-y-auto no-scrollbar rotate-180 "
      ref={bidsContainerRef}
    >
      {bids.map((bid: OrderData) => {
        const { price, amount, filledAmount } = bid;
        const size = (parseFloat(amount) - parseFloat(filledAmount)).toFixed(4);
        console.log(bid);
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

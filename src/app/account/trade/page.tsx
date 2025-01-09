"use client";
import { OrderBook, OrderData } from "@/app/Components/Orderbook/orderbook";
import { useEffect, useRef, useState } from "react";
import { OrderForm } from "@/app/Components/OrderForm/orderForm";
import { getBalances } from "@/actions/balance/getBalances";
import { useAuth } from "@/app/context/AuthContext";
import { Watchlist } from "@/app/Components/Watchlist/watchlist";
import { TradeHistory } from "@/app/Components/TradeHistory/tradeHistory";
import { HistoricalOrder } from "@/db/websocket";

export default function Trade() {
  const { balances, user } = useAuth();

  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const [tradeHistory, setTradeHistory] = useState<HistoricalOrder[]>([]);
  const [selectedBaseAsset, setSelectedBaseAsset] = useState("BTC");
  const [selectedQuoteAsset, setSelectedQuoteAsset] = useState("USD");
  const [displayedBalances, setDisplayedBalances] = useState(balances);
  const [currentDisplay, setCurrentDisplay] = useState("Order Book");
  const socketRef = useRef<WebSocket | null>(null);

  const updateBalances = async (userId: number) => {
    const newBalances = await getBalances(userId);
    setDisplayedBalances(newBalances);
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    const firstBook = `${selectedBaseAsset}-${selectedQuoteAsset}`;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({ type: "subscribe", id: user?.id, pair: firstBook })
      );
      console.log("ws open");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "order_book") {
        setAsks(data.asks);
        setBids(data.bids);
        if (data.tradeHistory !== undefined) {
          setTradeHistory(data.tradeHistory);
        }
      }
    };

    socketRef.current = ws;
    console.log(balances);

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  useEffect(() => {
    const socket = socketRef.current;
    const book = `${selectedBaseAsset}-${selectedQuoteAsset}`;
    const bookData = {
      type: "subscribe",
      id: user?.id,
      pair: book,
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(bookData));
      } catch (error) {
        console.error("Failed to update order book to show", error);
      }
    }
  }, [selectedBaseAsset, selectedQuoteAsset]);
  useEffect(() => {
    if (user?.id) {
      updateBalances(user.id);
    }
  }, [asks, bids]);

  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col h-full">
      <div className="max-h-full h-full flex justify-end">
        <Watchlist
          setSelectedBaseAsset={setSelectedBaseAsset}
          setSelectedQuoteAsset={setSelectedQuoteAsset}
        />
        <div className="hidden flex-1 min-[1270px]:flex flex-row ">
          <TradeHistory
            selectedBaseAsset={selectedBaseAsset}
            selectedQuoteAsset={selectedQuoteAsset}
            tradeHistory={tradeHistory}
            isHeaderDisplayed={true}
          />
          <OrderBook
            selectedBaseAsset={selectedBaseAsset}
            selectedQuoteAsset={selectedQuoteAsset}
            asks={asks}
            bids={bids}
            isHeaderDisplayed={true}
          />
        </div>
        <div className="flex flex-1 flex-col min-[1270px]:hidden">
          <div className="bg-violet-800 text-white py-4 px-6 w-full dark:bg-zinc-900 border-r dark:border-gray-600 ">
            <h2 className="font-semibold flex gap-2">
              <span
                className={`cursor-pointer transition-all duration-100 ${
                  currentDisplay === "Order Book"
                    ? "shadow-[inset_0_-2px_0_0_currentColor]"
                    : ""
                }`}
                onClick={() => {
                  setCurrentDisplay("Order Book");
                }}
              >
                Order Book
              </span>
              <span
                className={`cursor-pointer transition-all duration-100 ${
                  currentDisplay === "Trade History"
                    ? "shadow-[inset_0_-2px_0_0_currentColor]"
                    : ""
                }`}
                onClick={() => {
                  setCurrentDisplay("Trade History");
                }}
              >
                Trade History
              </span>
            </h2>
          </div>
          {currentDisplay === "Order Book" ? (
            <OrderBook
              selectedBaseAsset={selectedBaseAsset}
              selectedQuoteAsset={selectedQuoteAsset}
              asks={asks}
              bids={bids}
              isHeaderDisplayed={false}
            />
          ) : (
            <TradeHistory
              selectedBaseAsset={selectedBaseAsset}
              selectedQuoteAsset={selectedQuoteAsset}
              tradeHistory={tradeHistory}
              isHeaderDisplayed={false}
            />
          )}
        </div>

        <OrderForm
          selectedBaseAsset={selectedBaseAsset}
          selectedQuoteAsset={selectedQuoteAsset}
          displayedBalances={displayedBalances}
          socketRef={socketRef}
          asks={asks}
          bids={bids}
        />
      </div>
    </div>
  );
}

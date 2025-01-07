"use client";
import { OrderBook, OrderData } from "@/app/Components/Orderbook/orderbook";
import { useEffect, useRef, useState } from "react";
import { OrderForm } from "@/app/Components/OrderForm/orderForm";
import { getBalances } from "@/actions/balance/getBalances";
import { useAuth } from "@/app/context/AuthContext";
import { Watchlist } from "@/app/Components/Watchlist/watchlist";

export default function Trade() {
  const { balances, user } = useAuth();

  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const [selectedBaseAsset, setSelectedBaseAsset] = useState("BTC");
  const [selectedQuoteAsset, setSelectedQuoteAsset] = useState("USD");
  const [displayedBalances, setDisplayedBalances] = useState(balances);
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
        <OrderBook
          selectedBaseAsset={selectedBaseAsset}
          selectedQuoteAsset={selectedQuoteAsset}
          asks={asks}
          bids={bids}
        />
        <OrderForm
          selectedBaseAsset={selectedBaseAsset}
          selectedQuoteAsset={selectedQuoteAsset}
          setSelectedBaseAsset={setSelectedBaseAsset}
          setSelectedQuoteAsset={setSelectedQuoteAsset}
          displayedBalances={displayedBalances}
          socketRef={socketRef}
          asks={asks}
          bids={bids}
        />
      </div>
    </div>
  );
}

"use client";
import { OrderBook, OrderData } from "@/app/Components/Orderbook/orderbook";
import { useEffect, useRef, useState } from "react";
import { OrderForm } from "@/app/Components/OrderForm/orderForm";
import { getBalances } from "@/actions/balance/getBalances";
import { useAuth } from "@/app/context/AuthContext";
import { Watchlist } from "@/app/Components/Watchlist/watchlist";
import { TradeHistory } from "@/app/Components/TradeHistory/tradeHistory";
import { HistoricalOrder } from "@/db/websocket";
import { MobileWatchlist } from "@/app/Components/Watchlist/mobileWatchlist";
import { MobileOrderForm } from "@/app/Components/OrderForm/mobileOrderForm";

function preciseSubtraction(value1: string, value2: string): string {
  const scaleNumber = Math.pow(10, 8);
  const answer =
    (Math.round(parseFloat(value1) * scaleNumber) -
      Math.round(parseFloat(value2) * scaleNumber)) /
    scaleNumber;

  return answer.toString();
}

export default function Trade() {
  const { balances, user } = useAuth();
  const [asks, setAsks] = useState<OrderData[]>([]);
  const [bids, setBids] = useState<OrderData[]>([]);
  const [tradeHistory, setTradeHistory] = useState<HistoricalOrder[]>([]);
  const [selectedBaseAsset, setSelectedBaseAsset] = useState("BTC");
  const [selectedQuoteAsset, setSelectedQuoteAsset] = useState("USD");
  const [displayedBalances, setDisplayedBalances] = useState(balances);
  const [currentDisplay, setCurrentDisplay] = useState("Order Book");
  const [spread, setSpread] = useState(0);
  const [isMobileTransactionActive, setIsMobileTransactionActive] =
    useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const currentBook = `${selectedBaseAsset}-${selectedQuoteAsset}`;
  const startTransaction = () => {
    setIsMobileTransactionActive(true);
  };
  const updateBalances = async (userId: number) => {
    const newBalances = await getBalances(userId);
    setDisplayedBalances(newBalances);
  };
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}:8443`);
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
        console.log(asks);
        setBids(data.bids);
        if (data.tradeHistory !== undefined) {
          setTradeHistory(data.tradeHistory);
        }
      }
    };

    socketRef.current = ws;

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

    if (asks.length > 0 && bids.length > 0) {
      const bestAsk = asks[0].price;
      const bestBid = bids[0].price;
      const newSpread = +preciseSubtraction(bestAsk, bestBid);
      setSpread(newSpread);
    } else {
      setSpread(0);
    }
  }, [asks, bids]);

  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col h-full ">
      <div className="max-h-full h-full flex flex-col min-[505px]:flex-row">
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
            spread={spread}
          />
        </div>
        <div className="flex flex-grow flex-col min-[1270px]:hidden overflow-hidden relative">
          <div className="bg-violet-800 text-white py-4 px-6 w-full dark:bg-zinc-900  border-r-0 dark:border-gray-600 flex justify-between">
            <h2 className="font-semibold flex gap-3">
              <span
                className={`cursor-pointer transition-all duration-100 text-nowrap ${
                  currentDisplay === "Order Book" &&
                  "shadow-[inset_0_-2px_0_0_currentColor]"
                }`}
                onClick={() => {
                  setCurrentDisplay("Order Book");
                }}
              >
                Order Book
              </span>
              <span
                className={`cursor-pointer transition-all duration-100 text-nowrap ${
                  currentDisplay === "Trade History" &&
                  "shadow-[inset_0_-2px_0_0_currentColor]"
                }`}
                onClick={() => {
                  setCurrentDisplay("Trade History");
                }}
              >
                Trade History
              </span>
            </h2>
            <MobileWatchlist
              setSelectedBaseAsset={setSelectedBaseAsset}
              setSelectedQuoteAsset={setSelectedQuoteAsset}
              currentBook={currentBook}
            />
          </div>
          <div className="flex flex-grow overflow-hidden ">
            {currentDisplay === "Order Book" ? (
              <OrderBook
                selectedBaseAsset={selectedBaseAsset}
                selectedQuoteAsset={selectedQuoteAsset}
                asks={asks}
                bids={bids}
                isHeaderDisplayed={false}
                spread={spread}
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
          <div className="flex w-full p-2 py-4 min-[885px]:hidden flex-shrink-0 gap-1">
            <button
              onClick={() => {
                startTransaction();
              }}
              className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all bg-green-700 text-white`}
            >
              Buy
            </button>
            <button
              onClick={() => {
                startTransaction();
              }}
              className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all bg-red-700 text-white`}
            >
              Sell
            </button>
          </div>
          {isMobileTransactionActive && (
            <MobileOrderForm
              selectedBaseAsset={selectedBaseAsset}
              selectedQuoteAsset={selectedQuoteAsset}
              displayedBalances={displayedBalances}
              socketRef={socketRef}
              asks={asks}
              bids={bids}
              closeModal={() => setIsMobileTransactionActive(false)}
            />
          )}
        </div>
        <div className="hidden min-[885px]:flex">
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
    </div>
  );
}

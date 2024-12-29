"use client";
import { useAuth } from "@/app/context/AuthContext";
import Account from "../page";
import { getHistoricalOrders } from "@/actions/orders/getHistoricalOrders";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  createdAt: Date;
  userId: number;
  orderType: string;
  side: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  amount: string;
  status: string;
};
type Filter = "buy" | "sell" | "all" | "completed" | "pending";
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default function Orders() {
  return (
    <Account>
      <OrdersLayout />
    </Account>
  );
}

export function OrdersLayout() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Filter>("all");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      if (user?.id) {
        try {
          const myOrders = await getHistoricalOrders(user.id);
          setOrders(myOrders);
          setFilteredOrders(myOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrders();
  }, [user?.id]);

  const changeFilter = (newFilter: Filter) => {
    setSelected(newFilter);
    if (newFilter === "buy") {
      let newOrders = orders.filter((order) => order.side === "buy");
      setFilteredOrders(newOrders);
    } else if (newFilter === "sell") {
      let newOrders = orders.filter((order) => order.side === "sell");
      setFilteredOrders(newOrders);
    } else {
      setFilteredOrders(orders);
    }
  };

  const changeStatusColor = (status: string) => {
    if (status === "completed") {
      return "text-green-500";
    } else if (status === "pending") {
      return "text-orange-500";
    } else if (status === "cancelled") {
      return "text-red-500";
    }
  };
  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col p-8 flex-1 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Order History</h1>
      <div className="bg-gray-300 text-gray-700 dark:bg-zinc-700 dark:text-gray-300 font-semibold mb-6 flex rounded-md max-w-fit">
        <button
          onClick={() => changeFilter("all")}
          className={`p-2 px-4 rounded-md transition-colors ${
            selected === "all" && "bg-violet-800 dark:bg-violet-600 text-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => changeFilter("buy")}
          className={`p-2 rounded-md px-4 transition-colors ${
            selected === "buy" && "bg-violet-800 dark:bg-violet-600 text-white"
          }`}
        >
          Buys
        </button>
        <button
          onClick={() => changeFilter("sell")}
          className={`p-2 rounded-md px-4 transit tranisition-colors ${
            selected === "sell" && "bg-violet-800 dark:bg-violet-600 text-white"
          }`}
        >
          Sells
        </button>
      </div>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="flex flex-col gap-8 dark:text-white">
          {loading ? (
            <div>loading..</div>
          ) : (
            filteredOrders.map((order: Order) => (
              <li key={order.id} className="p-2 border-b flex justify-between">
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Order ID</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Amount</span>
                  <span>{order.amount}</span>
                </div>
                <div className="flex flex-col itemsce`">
                  <span className="font-semibold">Price</span>
                  <span>${order.price}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold pr-1">Status</span>
                  <span className={`${changeStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="font-semibold pr-1 flex flex-col">Side</span>
                  <span
                    className={` font-semibold ${
                      order.side === "buy" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {capitalizeFirstLetter(order.side)}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

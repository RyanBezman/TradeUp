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

  useEffect(() => {
    async function fetchOrders() {
      if (user?.id) {
        try {
          const myOrders = await getHistoricalOrders(user.id);
          setOrders(myOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrders();
  }, [user?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col p-8 flex-1">
      <h1 className="text-2xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {orders.map((order) => (
            <li key={order.id} className="p-2 border-b flex justify-between">
              <div>
                <span className="font-semibold">Order ID:</span>
                {order.id}
              </div>
              <div>
                <span className="font-semibold">Amount:</span> {order.amount}
              </div>
              <div>
                <span className="font-semibold">Price:</span> ${order.price}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {order.status}
              </div>
              <div>
                <span className={`font-semibold pr-1 `}>Side:</span>
                <span
                  className={` font-semibold ${
                    order.side === "buy" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {capitalizeFirstLetter(order.side)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

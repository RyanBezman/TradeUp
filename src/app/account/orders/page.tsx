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
  orderBook: string;
};

type Filter = "buy" | "sell" | "all" | "completed" | "pending";

/** Capitalize the first letter of a string */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Format date to something more readable, e.g., Oct 12, 2023, 5:02 PM */
function formatDate(dateString: Date): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** A small modal component to show order details */
function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black w-96 max-w-full p-6 rounded-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-lg font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <div className="space-y-2">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(order.createdAt)}
          </p>
          <p>
            <strong>Amount:</strong> {order.amount}
          </p>
          <p>
            <strong>Price:</strong> ${order.price}
          </p>
          <p>
            <strong>Status:</strong> {capitalizeFirstLetter(order.status)}
          </p>
          <p>
            <strong>Side:</strong> {capitalizeFirstLetter(order.side)}
          </p>
          <p>
            <strong>Order Book:</strong> {order.baseAsset}-{order.quoteAsset}
          </p>
          <p>
            <strong>Order Type:</strong>{" "}
            {capitalizeFirstLetter(order.orderType)}
          </p>
          <p>
            <strong>User ID:</strong> {order.userId}
          </p>
        </div>
      </div>
    </div>
  );
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      setFilteredOrders(orders.filter((order) => order.side === "buy"));
    } else if (newFilter === "sell") {
      setFilteredOrders(orders.filter((order) => order.side === "sell"));
    } else {
      setFilteredOrders(orders);
    }
  };

  const changeStatusColor = (status: string) => {
    if (status === "completed") return "text-green-500";
    if (status === "pending") return "text-orange-500";
    if (status === "cancelled") return "text-red-500";
    return "";
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl flex flex-col min-[455px]:p-8 flex-1 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Order History</h1>

      {/* Filter Buttons */}
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
          className={`p-2 rounded-md px-4 transition-colors ${
            selected === "sell" && "bg-violet-800 dark:bg-violet-600 text-white"
          }`}
        >
          Sells
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200 dark:border-zinc-700">
          <thead>
            <tr className="bg-violet-800 text-white dark:bg-gray-800">
              <th className="border border-gray-200 dark:border-gray-700 p-2">
                Order ID
              </th>
              <th className="border border-gray-200 dark:border-gray-700 p-2">
                Created At
              </th>
              <th className="border border-gray-200 dark:border-gray-700 p-2">
                Amount
              </th>
              <th className="border hidden sm:table-cell border-gray-200 dark:border-gray-700 p-2">
                Price
              </th>
              <th className="border hidden sm:table-cell border-gray-200 dark:border-gray-700 p-2">
                Status
              </th>
              <th className="border border-gray-200 dark:border-gray-700 p-2">
                Side
              </th>
              <th className="border hidden sm:table-cell border-gray-200 dark:border-gray-700 p-2">
                Book
              </th>

              <th className="border border-gray-200 dark:border-gray-700 p-2">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="text-center odd:bg-gray-50 even:bg-white dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {order.id}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {formatDate(order.createdAt)}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  {order.amount}
                </td>
                <td className="border hidden sm:table-cell border-gray-200 dark:border-gray-700 p-2">
                  ${order.price}
                </td>
                <td
                  className={`border hidden sm:table-cell border-gray-200 dark:border-gray-700 p-2 ${changeStatusColor(
                    order.status
                  )}`}
                >
                  {capitalizeFirstLetter(order.status)}
                </td>
                <td
                  className={`border border-gray-200 dark:border-gray-700 p-2 ${
                    order.side === "buy" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {capitalizeFirstLetter(order.side)}
                </td>
                <td className="border hidden sm:table-cell border-gray-200 dark:border-gray-700 p-2">
                  {order.baseAsset}-{order.quoteAsset}
                </td>
                <td className="border border-gray-200 dark:border-gray-700 p-2">
                  <button
                    onClick={() => openModal(order)}
                    className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 text-sm rounded-md"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
}

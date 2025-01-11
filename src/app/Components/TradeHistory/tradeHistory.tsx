import { ColumnHeader } from "../Orderbook/columnHeader";
import { LabelHeader } from "../Orderbook/labelheader";
import { HistoricalOrder } from "@/db/websocket";

type TradeHistoryProps = {
  selectedBaseAsset: string;
  selectedQuoteAsset: string;
  tradeHistory: HistoricalOrder[];
  isHeaderDisplayed: boolean;
};
function formatDate(dateString: Date): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function TradeHistory({
  selectedBaseAsset,
  selectedQuoteAsset,
  tradeHistory,
  isHeaderDisplayed,
}: TradeHistoryProps) {
  return (
    <div className="flex border border-t-0 border-l-0 flex-1  flex-col dark:border-gray-600">
      {isHeaderDisplayed && <ColumnHeader title="Trade History" />}

      <LabelHeader
        left={`Amount (${selectedBaseAsset})`}
        right={`Price (${selectedQuoteAsset})`}
        colThree="Time"
      />
      <ul>
        {tradeHistory.length > 0 &&
          tradeHistory.map((trade, i) => {
            const date = formatDate(trade.createdAt);
            const isAnimated = i <= 3;
            return (
              <Cell
                key={date + trade.amount + i}
                size={trade.amount}
                price={trade.price}
                type={trade.side}
                createdAt={date}
                isAnimated={isAnimated}
              />
            );
          })}
      </ul>
    </div>
  );
}

type CellProps = {
  size: string;
  price: string;
  type: string;
  createdAt: string;
  isAnimated: boolean;
};
export function Cell({ size, price, type, createdAt, isAnimated }: CellProps) {
  const numSize = +size;
  console.log(typeof createdAt);
  return (
    <div className="flex  justify-end px-2 py-1">
      <span
        className={`w-1/3 flex flex-1 justify-end  dark:text-white ${
          type === "sell" && isAnimated && "fade-to-color start-green"
        } ${type === "buy" && isAnimated && "fade-to-color start-red"}`}
      >
        {numSize.toFixed(8)}
      </span>
      <span
        className={`w-1/3 flex justify-end text-fade ${
          type === "sell" ? "text-green-500" : "text-red-500"
        }`}
      >
        {price}
      </span>
      <span className="w-1/3 text-end dark:text-white">{createdAt}</span>
    </div>
  );
}

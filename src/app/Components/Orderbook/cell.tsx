type CellProps = {
  size: string;
  price: string;
  type: "sell" | "bid";
};
export function Cell({ size, price, type }: CellProps) {
  return (
    <div
      className={`flex justify-end px-2 ${type !== "sell" && "rotate-180"} `}
    >
      <span
        className={`w-1/3  flex justify-end fade-to-color dark:text-white ${
          type === "sell" ? "start-green" : "start-red"
        }`}
      >
        {size}
      </span>
      <span
        className={`w-1/3 flex justify-end text-fade ${
          type === "sell" ? "text-green-500" : "text-red-500"
        }`}
      >
        {price}
      </span>
      <span className="w-1/3 text-end dark:text-white">-</span>
    </div>
  );
}

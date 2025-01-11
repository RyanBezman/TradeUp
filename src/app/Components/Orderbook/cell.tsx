type CellProps = {
  size: string;
  price: string;
  type: "sell" | "bid";
  isAnimated: boolean;
};
export function Cell({ size, price, type, isAnimated }: CellProps) {
  return (
    <div
      className={`flex justify-end px-2 ${type !== "sell" && "rotate-180"} `}
    >
      <span
        className={`w-1/3  flex justify-end  dark:text-white ${
          type === "sell" && isAnimated && "fade-to-color start-green"
        } ${isAnimated && type === "bid" && "fade-to-color start-red"}`}
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

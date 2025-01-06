type PlaceOrderButtonProps = {
  isSelected: string;
  handlePlaceOrder: () => void;
  buyError: string | null;
  sellError: string | null;
};
export function PlaceOrderButton({
  isSelected,
  handlePlaceOrder,
  buyError,
  sellError,
}: PlaceOrderButtonProps) {
  return (
    <>
      <span className="text-red-500 text-sm">
        {isSelected === "buy" && buyError}
        {isSelected === "sell" && sellError}
      </span>
      <button
        onClick={handlePlaceOrder}
        className="py-3 px-6 rounded-full font-semibold w-full transition-all bg-violet-800 dark:bg-green-700 text-white hover:bg-violet-700"
      >
        Place {isSelected === "buy" ? "Buy" : "Sell"} Order
      </button>
    </>
  );
}

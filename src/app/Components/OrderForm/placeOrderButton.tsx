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
  let isButtonDisabled = sellError !== null || buyError !== null;
  return (
    <div className="my-6 flex flex-col items-center gap-4">
      <button
        onClick={handlePlaceOrder}
        disabled={isButtonDisabled}
        className={`${
          isButtonDisabled && "opacity-70"
        } py-3 px-6 rounded-full font-semibold w-full transition-all bg-violet-800 dark:bg-green-700 text-white hover:bg-violet-700`}
      >
        {isButtonDisabled
          ? "Add funds to continue"
          : `Place ${isSelected === "buy" ? "Buy" : "Sell"} Order`}
      </button>
    </div>
  );
}

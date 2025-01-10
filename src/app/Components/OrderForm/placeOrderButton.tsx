import { Loader } from "lucide-react";

type PlaceOrderButtonProps = {
  isSelected: string;
  handlePlaceOrder: () => void;
  buyError: string | null;
  sellError: string | null;
  loading: boolean;
};
export function PlaceOrderButton({
  isSelected,
  handlePlaceOrder,
  buyError,
  sellError,
  loading,
}: PlaceOrderButtonProps) {
  const isButtonDisabled = sellError !== null || buyError !== null;
  return (
    <div className="my-6 flex flex-col items-center gap-4">
      {loading ? (
        <button
          onClick={handlePlaceOrder}
          disabled={isButtonDisabled}
          className={`${
            isButtonDisabled && " opacity-70"
          } flex items-center justify-center py-3 px-6 rounded-full font-semibold w-full transition-all bg-violet-800  text-white hover:bg-violet-700`}
        >
          <Loader className="animate-spin h-6 w-6 text-white" />
        </button>
      ) : (
        <button
          onClick={handlePlaceOrder}
          disabled={isButtonDisabled}
          className={`${
            isButtonDisabled && " opacity-70"
          } py-3 px-6 rounded-full font-semibold w-full transition-all bg-violet-800  text-white hover:bg-violet-700`}
        >
          {isButtonDisabled
            ? "Add funds to continue"
            : `Place ${isSelected === "buy" ? "Buy" : "Sell"} Order`}
        </button>
      )}
    </div>
  );
}

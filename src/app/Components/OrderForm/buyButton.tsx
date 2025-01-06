type BuyButtonProps = {
  isSelected: string;
  handleBuyButtonClick: () => void;
};
export function BuyButton({
  handleBuyButtonClick,
  isSelected,
}: BuyButtonProps) {
  return (
    <button
      onClick={handleBuyButtonClick}
      className={`py-2 px-4 rounded-full font-semibold flex-1 transition-all ${
        isSelected === "buy"
          ? "bg-violet-800 dark:bg-green-700 text-white shadow-md"
          : "bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-zinc-600"
      }`}
    >
      Buy
    </button>
  );
}

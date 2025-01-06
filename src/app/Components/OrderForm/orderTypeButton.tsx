type OrderTypeButtonProps = {
  toggleOrderType: () => void;
  orderType: string;
  type: string;
};
export function OrderTypeButton({
  toggleOrderType,
  orderType,
  type,
}: OrderTypeButtonProps) {
  const displayText = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <button
      onClick={toggleOrderType}
      className={`cursor-pointer text-2xl ${
        orderType === type
          ? "border-b-2 text-black border-black dark:text-white dark:border-white font-semibold"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {displayText}
    </button>
  );
}

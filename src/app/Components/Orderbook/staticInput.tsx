"use client";

type StaticInputProps = {
  amount: string;
  setAmount: (value: string) => void;
  setSellError: (value: string | null) => void;
  setBuyError: (value: string | null) => void;
};

export default function StaticInput({
  amount,
  setAmount,
  setSellError,
  setBuyError,
}: StaticInputProps) {
  const decimalRegex = /^\d*\.?\d*$/;

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="bg-transparent text-black dark:text-white outline-none text-xl border rounded-md p-2"
        value={amount}
        placeholder="0"
        onChange={(e) => {
          const val = e.target.value;
          if (val === "" || decimalRegex.test(val)) {
            setAmount(val);
          }
          setSellError(null);
          setBuyError(null);
        }}
        onBlur={() => {
          if (amount) {
            const numericValue = Number(amount);
            if (!isNaN(numericValue)) {
              setAmount(
                numericValue.toLocaleString("en-US", {
                  minimumFractionDigits: amount.includes(".")
                    ? amount.split(".")[1].length
                    : 0,
                })
              );
            }
          }
        }}
      />
      <span className="dark:text-white text-gray-400 ml-2 text-xl">BTC</span>
    </div>
  );
}

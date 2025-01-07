"use client";

import { Balance } from "@/app/context/AuthContext";

type StaticInputProps = {
  amount: string;
  setAmount: (value: string) => void;
  setSellError: (value: string | null) => void;
  setBuyError: (value: string | null) => void;
  selectedCoin: string;
  label?: string;
  isSelected: string;
  buyError: string | null;
  sellError: string | null;
  displayedBalances: Balance[] | null;
};

export default function StaticInput({
  amount,
  setAmount,
  setSellError,
  setBuyError,
  selectedCoin,
  label,
  isSelected,
  buyError,
  sellError,
  displayedBalances,
}: StaticInputProps) {
  const decimalRegex = /^\d*\.?\d*$/;

  return (
    <div className="flex flex-col gap-1 relative">
      <span className="font-semibold dark:text-white text-black">{label}</span>
      <div>
        <input
          type="text"
          className={`bg-transparent text-black dark:text-white outline-none text-xl border rounded-md p-2  focus:ring-2 focus:ring-violet-800 ${
            sellError && "focus:ring-red-500"
          }`}
          value={amount}
          placeholder="0"
          onChange={(e) => {
            setSellError(null);
            setBuyError(null);
            const val = e.target.value;
            if (isSelected === "sell" && displayedBalances) {
              for (const balance of displayedBalances) {
                if (balance.asset === selectedCoin) {
                  if (+balance.balance < +val) {
                    setSellError("Insufficient funds, please try again.");
                    break;
                  }
                }
              }
            }
            if (val === "" || decimalRegex.test(val)) {
              setAmount(val);
            }
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
        <span className="dark:text-white text-gray-400 ml-2 text-xl">
          {selectedCoin}
        </span>
      </div>
      <span className="text-red-500 text-sm left-1 top-20 absolute">
        {isSelected === "buy" && buyError}
        {isSelected === "sell" && sellError}
      </span>
    </div>
  );
}

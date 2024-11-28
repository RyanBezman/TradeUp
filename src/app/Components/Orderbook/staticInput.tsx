"use client";

import { useState } from "react";

const handleInputNumber = (value: number | string): string => {
  if (!value) return "";

  const stringVal = value.toString().replace(/,/g, "");
  const numberValue = +stringVal;

  if (isNaN(numberValue)) return "";

  return numberValue.toLocaleString("en-US");
};

export default function StaticInput() {
  const [input, setInput] = useState<number | string>("");

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="bg-transparent text-black dark:text-white outline-none text-xl border rounded-md p-2"
        value={input}
        placeholder="0"
        onChange={(e) => {
          let value = e.target.value.replace(/,/g, "");
          if (value.length > 9) {
            return;
          }
          const newValue = handleInputNumber(value);
          setInput(newValue);
        }}
      />
      <span className="dark:text-white text-gray-400 ml-2 text-xl">USD</span>
    </div>
  );
}

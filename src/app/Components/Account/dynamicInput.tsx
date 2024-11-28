"use client";
import { useState } from "react";
const handleInputNumber = (value: number | string): string => {
  if (!value) return "";

  const stringVal = value.toString().replace(/,/g, "");
  const numberValue = +stringVal;

  if (isNaN(numberValue)) return "";

  return numberValue.toLocaleString("en-US");
};

export default function DynamicInput() {
  const [input, setInput] = useState<number | string>("");
  const [fontSize, setFontSize] = useState(5);

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="bg-transparent text-black outline-none"
        value={input}
        placeholder="0"
        style={{
          width: `${Math.max(input.toString().length, 1)}ch`,
          minWidth: "1ch",
          fontSize: `${fontSize}rem`,
        }}
        onChange={(e) => {
          let value = e.target.value.replace(/,/g, "");
          if (value.length > 9) {
            return;
          }
          const newValue = handleInputNumber(value);
          console.log(newValue.length);
          setInput(newValue);

          const length = value.length;

          const newFontSize = Math.max(5 - length * 0.2, 2);
          setFontSize(newFontSize);
        }}
      />
      <span
        className="dark:text-white text-gray-400 ml-2"
        style={{
          fontSize: `${fontSize}rem`,
        }}
      >
        USD
      </span>
    </div>
  );
}

"use client";
import { SignupData } from "./signupForm";

type FormInputProps = {
  label: string;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
  fieldKey: string;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export function FormInput({
  placeholder,
  label,
  fieldKey,
  setSignupData,
  inputRef,
}: FormInputProps) {
  return (
    <div className="flex flex-col flex-1 py-4">
      <label
        htmlFor="name"
        className="mb-2 font-semibold text-black dark:text-gray-300"
      >
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="border p-2 outline-none rounded-lg bg-white dark:bg-zinc-600 text-black dark:text-white border-gray-300 dark:border-zinc-600 placeholder-gray-500 dark:placeholder-gray-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600"
        onChange={(e) =>
          setSignupData((prev) => {
            return { ...prev, [fieldKey]: e.target.value };
          })
        }
      />
    </div>
  );
}

type SignInData = {
  email: string;
  password: string;
};

type FormInputProps = {
  label: string;
  setSignInData: React.Dispatch<React.SetStateAction<SignInData>>;
  fieldKey: string;
  placeholder: string;
};

export function SignInFormInput({
  placeholder,
  label,
  fieldKey,
  setSignInData,
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
        type="text"
        placeholder={placeholder}
        className="border p-2 outline-none rounded-lg bg-white dark:bg-zinc-600 text-black dark:text-white border-gray-300 dark:border-zinc-600 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600"
        onChange={(e) =>
          setSignInData((prev) => {
            return { ...prev, [fieldKey]: e.target.value };
          })
        }
      />
    </div>
  );
}

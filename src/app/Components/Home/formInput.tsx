import { SignupData } from "./signupForm";
type SignInData = {
  email: string;
  password: string;
};
type FormInputProps = {
  label: string;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
  fieldKey: string;
  placeholder: string;
};
export function FormInput({
  placeholder,
  label,
  fieldKey,
  setSignupData,
}: FormInputProps) {
  return (
    <div className="flex flex-col flex-1  py-4">
      <label htmlFor="name" className="mb-2 font-semibold text-gray-300">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="border p-2 outline-none rounded-lg border-zinc-600 bg-zinc-600 text-white"
        onChange={(e) =>
          setSignupData((prev) => {
            return { ...prev, [fieldKey]: e.target.value };
          })
        }
      />
    </div>
  );
}

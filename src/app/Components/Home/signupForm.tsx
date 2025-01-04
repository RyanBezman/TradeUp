"use client";
import { Loader, X } from "lucide-react";
import { FormInput } from "./formInput";
import { FormEvent, useState } from "react";
import { addUser } from "@/actions/user/addUser";

type SignupFormProps = {
  setIsFormOpen: (arg: boolean) => void;
  setIsLoginOpen: (arg: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};
export type SignupData = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};
const initialSignupData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
};
const formFields = [
  { label: "Email", fieldKey: "email" },
  { label: "Phone", fieldKey: "phone" },
  { label: "Password", fieldKey: "password" },
  { label: "Address 1", fieldKey: "address1" },
  { label: "Address 2 (optional)", fieldKey: "address2" },
  { label: "City", fieldKey: "city" },
];

export function SignupForm({
  setIsFormOpen,
  setIsLoginOpen,
  inputRef,
}: SignupFormProps) {
  const [signupData, setSignupData] = useState<SignupData>(initialSignupData);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addUser(signupData);
      setSignupData(initialSignupData);
      setIsFormOpen(false);
      setIsLoginOpen(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred during signup:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex z-40 items-center bg-gray-400 bg-opacity-50 dark:bg-black dark:bg-opacity-80 justify-center">
      <form
        onSubmit={handleSignup}
        className="flex flex-col bg-white dark:bg-black border border-gray-300 dark:border-gray-600 w-full max-w-xl max-h-[95vh] p-10 rounded-2xl shadow-lg overflow-auto"
      >
        <div className="flex items-center justify-between pb-8">
          <h3 className="text-black dark:text-white font-bold text-2xl">
            Sign Up Now!
          </h3>
          <X
            type="button"
            className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white h-6 w-6 cursor-pointer"
            onClick={() => setIsFormOpen(false)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex sm:flex-row flex-col gap-4">
            <FormInput
              inputRef={inputRef}
              key={"firstName"}
              label={"First Name"}
              fieldKey="firstName"
              placeholder="Enter first name"
              setSignupData={setSignupData}
            />
            <FormInput
              key={"lastName"}
              label={"Last Name"}
              fieldKey="lastName"
              placeholder="Enter last name"
              setSignupData={setSignupData}
            />
          </div>
          {formFields.map(({ label, fieldKey }) => (
            <FormInput
              key={fieldKey}
              label={label}
              fieldKey={fieldKey}
              placeholder={`Enter ${label.toLowerCase()}`}
              setSignupData={setSignupData}
            />
          ))}
          <div className="flex gap-4 sm:flex-row flex-col">
            <FormInput
              key={"state"}
              label={"State"}
              fieldKey="state"
              placeholder="Enter state"
              setSignupData={setSignupData}
            />
            <FormInput
              key={"zip"}
              label={"Zip"}
              fieldKey="zip"
              placeholder="Enter zip"
              setSignupData={setSignupData}
            />
          </div>
        </div>

        <div className="flex justify-end px-2 pt-14 gap-4">
          <button
            type="button"
            className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-white font-semibold"
            onClick={() => setIsFormOpen(false)}
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-violet-800 dark:bg-white text-white dark:text-black py-4 px-8 rounded-xl font-semibold hover:bg-violet-700 dark:hover:bg-gray-200"
          >
            {isLoading ? (
              <Loader className="animate-spin h-8 w-8 text-gray-500" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

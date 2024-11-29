"use client";

import { updateUser } from "@/actions/user/updateUser";
import { useAuth } from "@/app/context/AuthContext";
import { Check, Loader, Pencil } from "lucide-react";
import { FormEvent, useState } from "react";

type PersonalInfoItem = {
  label: string;
  value: string | React.ReactNode;
  column: ColumnLabel;
};

type PersonalInfoCardProps = {
  title: string;
};

type ColumnLabel =
  | "firstName"
  | "lastName"
  | "email"
  | "city"
  | "state"
  | "phone"
  | "zip"
  | "country"
  | "job";

export function InfoCard({ title }: PersonalInfoCardProps) {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const personalInfo: PersonalInfoItem[] = [
    { label: "First Name", value: user?.firstName, column: "firstName" },
    { label: "Last Name", value: user?.lastName, column: "lastName" },
    { label: "Email Address", value: user?.email, column: "email" },
    { label: "Phone", value: user?.phone, column: "phone" },
    { label: "Country", value: "USA", column: "country" },
    { label: "City", value: user?.city, column: "city" },
    { label: "State", value: user?.state, column: "state" },
    { label: "Zip Code", value: user?.zip, column: "zip" },
  ];

  const handleSubmit = async (column: ColumnLabel, e: FormEvent) => {
    e.preventDefault();
    if (user) {
      setIsLoading(true);

      try {
        await updateUser(user.id, column, inputValue);
        setUser((prevUser) =>
          prevUser ? { ...prevUser, [column]: inputValue } : prevUser
        );
        setInputValue("");
        setActiveField("");
      } catch (error) {
        console.log("Trouble updating user", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (!relatedTarget || relatedTarget.tagName !== "BUTTON") {
      setActiveField("");
    }
  };

  return (
    <div className="w-full p-12 mt-10 flex flex-col justify-between max-w-[1200px] border dark:border-gray-600 border-gray-300 rounded-xl">
      <div className="flex justify-between items-center">
        <h2 className="dark:text-white text-2xl text-black font-bold">
          {title}
        </h2>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setActiveField("");
          }}
          className="flex items-center h-10 px-4 py-6 gap-3 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border rounded-lg"
        >
          {!isEditing && <Pencil className="w-5 h-5 font-semibold" />}
          <span className="text-lg font-semibold">
            {isEditing ? "Cancel" : "Edit"}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        {personalInfo.map((info) => (
          <div key={info.column} className="flex flex-col">
            <label className="text-gray-700 font-bold text-lg dark:text-gray-400 flex gap-4 items-center">
              {info.label}
              {isEditing && activeField !== info.label && (
                <Pencil
                  className="w-4 h-4 cursor-pointer hover:text-violet-600"
                  onClick={() => setActiveField(info.label)}
                />
              )}
            </label>
            {activeField === info.label && isEditing ? (
              <form
                onSubmit={(e) => handleSubmit(info.column, e)}
                className="flex items-center mt-2"
              >
                <input
                  type="text"
                  className="outline-none dark:bg-black dark:text-white text-lg"
                  onBlur={handleBlur}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  title="Save"
                  className="text-black dark:text-white ml-3"
                >
                  {isLoading ? (
                    <Loader className="animate-spin h-6 w-6 text-gray-500" />
                  ) : (
                    <Check className="w-6 h-6" />
                  )}
                </button>
              </form>
            ) : (
              <span className="text-black dark:text-white text-lg mt-2">
                {info.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

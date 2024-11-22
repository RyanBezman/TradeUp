"use client";
import { updateUser } from "@/actions/user/updateUser";
import { useAuth } from "@/app/context/AuthContext";
import { Check, Pencil } from "lucide-react";
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

  console.log(user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [inputValue, setInputValue] = useState("");
  const personalInfo: PersonalInfoItem[] = [
    {
      label: "First Name",
      value: user?.firstName,
      column: "firstName",
    },
    { label: "Last Name", value: user?.lastName, column: "lastName" },
    { label: "Email Address", value: user?.email, column: "email" },
    { label: "Phone", value: user?.phone, column: "phone" },
    { label: "Country", value: "USA", column: "country" },
    { label: "City", value: user?.city, column: "city" },
    { label: "State", value: user?.state, column: "state" },
    { label: "Zip Code", value: user?.zip, column: "zip" },
    { label: "Job", value: "Software Engineer", column: "job" },
  ];
  const handleSubmit = async (column: ColumnLabel, e: FormEvent) => {
    e.preventDefault();
    if (user) {
      console.log("we are trying to update");
      try {
        await updateUser(user.id, column, inputValue);
        setUser((prevUser) =>
          prevUser ? { ...prevUser, [column]: inputValue } : prevUser
        );
        setInputValue("");
        setActiveField("");
      } catch (error) {
        if (error) {
          console.log("Trouble updating user", error);
        }
      }
    }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    console.log("Blur event triggered for:", e.target);
    if (relatedTarget) {
      console.log("Focus is moving to:", relatedTarget.tagName);
    } else {
      console.log("Focus is moving outside");
    }

    if (!relatedTarget || relatedTarget.tagName !== "BUTTON") {
      setActiveField("");
    }
  };
  const renderRows = () => {
    const rows: JSX.Element[] = [];
    for (let i = 0; i < personalInfo.length; i += 2) {
      rows.push(
        <div key={`row-${i}`} className="flex gap-4 pt-4">
          <div className="flex flex-col w-1/2">
            <label className="text-gray-700 font-semibold dark:text-gray-400 flex gap-3 items-center">
              {personalInfo[i].label}
              {isEditing && (
                <Pencil
                  onClick={() => setActiveField(personalInfo[i].label)}
                  className="w-3 h-3 cursor-pointer"
                />
              )}
            </label>
            {activeField === personalInfo[i].label ? (
              <form
                onSubmit={(e) => {
                  handleSubmit(personalInfo[i].column, e);
                }}
                className="flex items-center"
              >
                <input
                  type="text"
                  className="outline-none dark:bg-black dark:text-white "
                  onBlur={handleBlur}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />{" "}
                <button
                  className="text-black dark:text-white"
                  title="Save"
                  type="submit"
                >
                  <Check className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <span className="text-black dark:text-white">
                {personalInfo[i].value}
              </span>
            )}
          </div>

          {i + 1 < personalInfo.length && (
            <div className="flex flex-col w-1/2">
              <label className="text-gray-700 font-semibold dark:text-gray-400 flex gap-3 items-center">
                {personalInfo[i + 1].label}
                {isEditing && (
                  <Pencil
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setActiveField(personalInfo[i + 1].label)}
                  />
                )}
              </label>
              {activeField === personalInfo[i + 1].label ? (
                <form
                  onSubmit={(e) => {
                    handleSubmit(personalInfo[i + 1].column, e);
                  }}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    className="outline-none dark:bg-black dark:text-white"
                    onBlur={handleBlur}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                  />{" "}
                  <button
                    className="text-black dark:text-white"
                    type="submit"
                    title="Save"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <span className="text-black dark:text-white">
                  {personalInfo[i + 1].value}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="w-full p-10 mt-8 flex flex-col justify-between border dark:border-gray-600 border-gray-300 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="dark:text-white text-lg text-black font-semibold">
          {title}
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center h-8 px-2 py-4 gap-2 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border"
        >
          {!isEditing && <Pencil className="w-4 h-4" />}
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </button>
      </div>
      <div className="flex flex-col w-full mt-6">{renderRows()}</div>
    </div>
  );
}

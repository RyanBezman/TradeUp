"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";

type PersonalInfoItem = {
  label: string;
  value: string | React.ReactNode;
};

type PersonalInfoCardProps = {
  title: string;
};

export function InfoCard({ title }: PersonalInfoCardProps) {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [activeField, setActiveField] = useState("");
  console.log(user);
  const personalInfo: PersonalInfoItem[] = [
    { label: "First Name", value: user?.firstName },
    { label: "Last Name", value: user?.lastName },
    { label: "Email Address", value: user?.email },
    { label: "Phone", value: user?.phone },
    { label: "Bio", value: "Software Engineer" },
  ];

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
              <div className="flex items-center">
                <input
                  type="text"
                  className="outline-none"
                  onBlur={() => setActiveField("")}
                  autoFocus
                />{" "}
                <button
                  type="submit"
                  className="text-black dark:text-white"
                  title="Save"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
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
                <div className="flex items-center">
                  <input
                    type="text"
                    className="outline-none"
                    onBlur={() => setActiveField("")}
                    autoFocus
                  />{" "}
                  <button
                    type="submit"
                    className="text-black dark:text-white"
                    title="Save"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
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
        <h2 className="dark:text-gray-400 text-lg text-black font-semibold">
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

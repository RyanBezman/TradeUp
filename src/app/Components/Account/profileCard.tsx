"use client";
import { updateUser } from "@/actions/user/updateUser";
import { useAuth } from "@/app/context/AuthContext";
import { Check, Loader, Pencil } from "lucide-react";
import { FormEvent, useState } from "react";

export function ProfileCard() {
  const { user, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobInfo, setJobInfo] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      setIsLoading(true);
      try {
        await updateUser(user?.id, "job", jobInfo);
        setUser((prevUser) =>
          prevUser ? { ...prevUser, ["job"]: jobInfo } : prevUser
        );
      } catch (error) {
        console.error("Trouble updating job info", error);
      } finally {
        setJobInfo("");
        setIsLoading(false);
        setIsEditingJob(false);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null;

    if (!relatedTarget || relatedTarget.tagName !== "BUTTON") {
      setIsEditingJob(false);
      setJobInfo("");
    }
  };

  return (
    <div className="w-full p-12 flex justify-between border dark:border-gray-600 border-gray-300 max-w-[1200px] rounded-xl">
      <div className="flex gap-8">
        <button className="flex items-center justify-center bg-violet-300 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-full w-20 h-20 hover:ring-4 hover:ring-violet-600 dark:hover:ring-gray-400 text-2xl">
          {user && user.firstName[0].toUpperCase()}
        </button>
        <div className="dark:text-gray-400 text-black">
          <h3 className="text-2xl dark:text-white font-bold">
            {user ? `${user.firstName} ${user.lastName}` : null}
          </h3>
          {isEditingJob && isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="items-center flex gap-4 mt-2"
            >
              <input
                type="text"
                onChange={(e) => setJobInfo(e.target.value)}
                value={jobInfo}
                className="outline-none text-lg dark:bg-black dark:text-white  "
                onBlur={handleBlur}
                autoFocus
              />
              <button
                type="submit"
                disabled={jobInfo.length < 1}
                className="text-black dark:text-white"
                title="Save"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-6 w-6 text-gray-500" />
                ) : (
                  <Check className="w-6 h-6" />
                )}
              </button>
            </form>
          ) : (
            <div
              className={`flex items-center gap-4 mt-2 ${
                !user?.job && "text-gray-400 dark:text-gray-600 italic"
              }`}
            >
              <p className="text-lg">{user?.job ? user.job : "Add new job"}</p>
              {isEditing && (
                <Pencil
                  onClick={() => {
                    setIsEditingJob(true);
                  }}
                  className="w-5 h-5 cursor-pointer text-black dark:text-gray-400 hover:text-violet-600 dark:hover:text-white"
                />
              )}
            </div>
          )}
          <p className="text-lg mt-2">
            {user && `${user.city}, ${user.state}, USA`}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="flex items-center h-12 px-4 py-6 gap-3 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border rounded-lg"
      >
        {!isEditing && <Pencil className="w-5 h-5 font-semibold" />}
        <span className="text-lg font-semibold">
          {isEditing ? "Cancel" : "Edit"}
        </span>
      </button>
    </div>
  );
}

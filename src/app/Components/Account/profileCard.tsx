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
        console.error("trouble updating job info", error);
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
    <div className="w-full p-10 flex justify-between border dark:border-gray-600 border-gray-300 max-w-[1080px] rounded-lg">
      <div className="flex gap-6">
        <button className="flex items-center justify-center bg-violet-300 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-full w-16 h-16 hover:ring-2 hover:ring-violet-600 dark:hover:ring-gray-400">
          {user && user.firstName[0].toUpperCase()}
        </button>
        <div className="dark:text-gray-400 text-black">
          <h3 className="text-xl dark:text-white font-bold">
            {user ? `${user.firstName} ${user.lastName}` : null}
          </h3>
          {isEditingJob ? (
            <form onSubmit={handleSubmit} className="items-center flex">
              <input
                type="text"
                onChange={(e) => setJobInfo(e.target.value)}
                value={jobInfo}
                className="outline-none text-sm dark:bg-black"
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
                  <Loader className="animate-spin h-5 w-5 text-gray-500" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm">{user?.job ? user.job : "Add new job"}</p>
              {isEditing && (
                <Pencil
                  onClick={() => {
                    setIsEditingJob(true);
                  }}
                  className="w-3 h-3 cursor-pointer"
                />
              )}
            </div>
          )}
          <p className="text-sm">
            {user && `${user.city}, ${user.state}, USA`}
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="flex items-center h-8 px-2 py-4 gap-2 text-black hover:dark:text-white dark:text-gray-400 hover:text-violet-600 border"
      >
        {!isEditing && <Pencil className="w-4 h-4" />}
        <span>{isEditing ? "Cancel" : "Edit"}</span>
      </button>
    </div>
  );
}

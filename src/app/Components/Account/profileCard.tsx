"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { Check, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
export function ProfileCard() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [jobInfo, setJobInfo] = useState("");
  const jobInputRef = useRef<HTMLInputElement | null>(null);

  useClickOutside(jobInputRef, isEditingJob, () => {
    setIsEditingJob(false);
    setJobInfo("");
  });
  useEffect(() => {
    if (isEditingJob) {
      jobInputRef.current?.focus();
    }
  }, [isEditingJob]);
  return (
    <div className="w-full p-10 flex justify-between border dark:border-gray-600 border-gray-300 rounded-lg">
      <div className="flex gap-6">
        <button className="flex items-center justify-center bg-violet-300 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-full w-16 h-16 hover:ring-2 hover:ring-violet-600 dark:hover:ring-gray-400">
          {user && user.firstName[0].toUpperCase()}
        </button>
        <div className="dark:text-gray-400 text-black">
          <h3 className="text-xl dark:text-white font-bold">
            {user ? `${user.firstName} ${user.lastName}` : null}
          </h3>
          {isEditingJob ? (
            <div className="items-center flex">
              <input
                type="text"
                onChange={(e) => setJobInfo(e.target.value)}
                value={jobInfo}
                className="outline-none"
                ref={jobInputRef}
              />
              <button
                type="submit"
                className="text-black dark:text-white"
                title="Save"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm">Software Engineer</p>
              {isEditing && (
                <Pencil
                  onClick={() => {
                    setIsEditingJob(true);
                    jobInputRef.current?.focus();
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

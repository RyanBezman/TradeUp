"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ConfirmSignOut } from "./confirmSignOut";
import SignInForm from "./signInForm";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const router = useRouter();

  return (
    <div>
      {user ? (
        <div className="flex gap-4 items-center">
          <button
            onClick={() => {
              router.push("/profile");
            }}
            className="flex items-center justify-center bg-violet-300 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-full w-12 h-12 hover:ring-2 hover:ring-violet-600 dark:hover:ring-gray-400"
          >
            {user.firstName[0].toUpperCase()}
          </button>
          <button
            className="bg-violet-800 dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-semibold hover:bg-violet-700 dark:hover:bg-gray-200"
            onClick={() => setIsConfirmingSignOut(true)}
          >
            Sign out
          </button>
          {isConfirmingSignOut && (
            <ConfirmSignOut setIsConfirmingSignout={setIsConfirmingSignOut} />
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-violet-800 dark:bg-white text-white dark:text-black py-4 px-8 rounded-xl font-semibold hover:bg-violet-700 dark:hover:bg-gray-200"
        >
          Sign In
        </button>
      )}
      {isFormOpen && <SignInForm setIsFormOpen={setIsFormOpen} />}
    </div>
  );
}

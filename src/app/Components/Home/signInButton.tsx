"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ConfirmSignOut } from "./confirmSignOut";
import SignInForm from "./signInForm";
import { signoutUser } from "@/actions/auth/signoutUser";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const { user, logout } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);
  const router = useRouter();

  return (
    <div>
      {user ? (
        <div className="flex gap-4 items-center ">
          <button
            onClick={() => {
              router.push("/account");
            }}
            className="flex items-center justify-center bg-gray-800 text-white font-bold rounded-full w-12 h-12  hover:ring-2 hover:ring-gray-400"
          >
            {user.firstName[0].toUpperCase()}
          </button>
          <button
            className="bg-white font-semibold text-black py-4 px-6 rounded-xl"
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
          className="bg-white font-semibold text-black py-4 px-8 rounded-xl"
        >
          Sign In
        </button>
      )}
      {isFormOpen && <SignInForm setIsFormOpen={setIsFormOpen} />}
    </div>
  );
}

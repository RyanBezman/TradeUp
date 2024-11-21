"use client";

import { useState } from "react";
import { SignupData, SignupForm } from "./signupForm";

type SignUpButtonProps = {
  onAddUser: (data: SignupData) => Promise<void>;
};

export function SignUpButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-20 px-10 justify-center ">
      <button
        className="bg-white font-semibold text-black text-lg  py-4 px-6 rounded-xl"
        onClick={() => setIsFormOpen(true)}
      >
        Sign up today!
      </button>{" "}
      <img
        src="/Images/middlescreenUI.png"
        className="h-[516px] w-[260px]"
        alt=""
      />
      {isFormOpen && (
        <SignupForm setIsFormOpen={setIsFormOpen} key="signInForm" />
      )}
    </div>
  );
}

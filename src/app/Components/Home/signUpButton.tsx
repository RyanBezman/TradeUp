"use client";

import { useEffect, useRef, useState } from "react";
import { SignupForm } from "./signupForm";
import Image from "next/image";
import SignInForm from "./signInForm";

export function SignUpButton() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormOpen]);

  return (
    <div className="flex flex-col items-center gap-20 px-10 justify-center">
      <button
        className="bg-violet-800 dark:bg-white text-white dark:text-black font-semibold text-lg py-4 px-6 rounded-xl hover:bg-violet-700 dark:hover:bg-gray-200"
        onClick={() => setIsFormOpen(true)}
      >
        Sign up today!
      </button>
      <Image
        src="/Images/middlescreenUI.png"
        height={516}
        width={260}
        alt="iphone image"
      />

      {isFormOpen && (
        <SignupForm
          inputRef={inputRef}
          setIsFormOpen={setIsFormOpen}
          setIsLoginOpen={setIsLoginOpen}
          key="signInForm"
        />
      )}
      {isLoginOpen && (
        <SignInForm
          setIsFormOpen={setIsLoginOpen}
          title="Your account has been made! Please sign in..."
        />
      )}
    </div>
  );
}
